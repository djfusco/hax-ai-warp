const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const VMManager = require('./lib/vm-manager');
const TerminalManager = require('./lib/terminal-manager');
const AuthManager = require('./lib/auth-manager');
const DockerContainerManager = require('./lib/docker-container-manager');

class HaxAIWarpServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.vmManager = new VMManager();
    this.terminalManager = new TerminalManager();
    this.authManager = new AuthManager();
    this.containerManager = new DockerContainerManager();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    
    // Give terminal manager access to socket.io
    this.terminalManager.setSocketIO(this.io);
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  setupRoutes() {
    // Main interface
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Student session creation
    this.app.post('/api/sessions', async (req, res) => {
      try {
        const { studentId, courseName, aiConfig } = req.body;
        console.log(`Creating session for ${studentId} in course ${courseName} with AI config:`, aiConfig);
        
        // Configure AI if provided
        if (aiConfig && aiConfig.provider !== 'pattern-matching' && aiConfig.apiKey) {
          this.configureAI(aiConfig);
        }
        
        const session = await this.createStudentSession(studentId, courseName);
        res.json({ success: true, session });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // VM management (keeping for backward compatibility)
    this.app.get('/api/vms', async (req, res) => {
      try {
        const vms = await this.vmManager.listVMs();
        res.json({ success: true, vms });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Container management
    this.app.get('/api/containers', async (req, res) => {
      try {
        const containers = await this.containerManager.listContainers();
        res.json({ success: true, containers });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Active terminals
    this.app.get('/api/terminals', (req, res) => {
      try {
        const terminals = this.terminalManager.getActiveTerminals();
        res.json({ success: true, terminals });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Save API keys to .env file
    this.app.post('/api/save-api-key', async (req, res) => {
      try {
        const { provider, apiKey } = req.body;
        
        if (!provider || !apiKey) {
          return res.status(400).json({ success: false, error: 'Provider and API key required' });
        }
        
        await this.saveApiKeyToEnv(provider, apiKey);
        res.json({ success: true, message: 'API key saved successfully' });
      } catch (error) {
        console.error('Error saving API key:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get configuration for frontend
    this.app.get('/api/config', (req, res) => {
      res.json({ 
        studentPassword: process.env.STUDENT_PASSWORD || 'defaultpass123'
      });
    });

    // Get AI status for frontend
    // Test AI endpoint
    this.app.get('/api/test-ai', (req, res) => {
      const testSuggestion = {
        type: 'guidance',
        title: '🤖 AI Assistant',
        message: 'This is a test AI suggestion to verify frontend display.',
        suggestion: 'Try running: ls -la',
        reasoning: 'Testing AI suggestion delivery and display'
      };
      
      // Broadcast to all connected clients for testing
      this.io.emit('ai-suggestion', testSuggestion);
      
      res.json({ message: 'Test AI suggestion sent', suggestion: testSuggestion });
    });

    this.app.get('/api/ai-status', (req, res) => {
      const aiTutor = this.terminalManager?.aiTutor;
      if (!aiTutor) {
        return res.json({ 
          provider: 'pattern-matching',
          connected: false,
          message: 'Pattern-matching mode active'
        });
      }

      if (aiTutor.openaiEnabled) {
        res.json({
          provider: 'openai',
          connected: true,
          message: 'OpenAI integration active'
        });
      } else if (aiTutor.anthropicEnabled) {
        res.json({
          provider: 'anthropic', 
          connected: true,
          message: 'Anthropic Claude integration active'
        });
      } else {
        res.json({
          provider: 'pattern-matching',
          connected: false, 
          message: 'Pattern-matching mode active'
        });
      }
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('create-terminal', async (data) => {
        try {
          const { studentId, courseName } = data;
          const terminal = await this.terminalManager.createTerminal(studentId, courseName);
          socket.join(`terminal-${terminal.id}`);
          socket.emit('terminal-created', { terminalId: terminal.id });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('terminal-input', (data) => {
        this.terminalManager.sendInput(data.terminalId, data.input);
        
        // Track characters as they're typed and commands when Enter is pressed
        const terminalSession = this.terminalManager.terminals.get(data.terminalId);
        if (terminalSession) {
          if (data.input === '\r' || data.input === '\n') {
            // Enter pressed - analyze the command that was just executed
            this.terminalManager.finalizeCommand(data.terminalId, terminalSession.studentId);
          } else if (data.input === '\u007f' || data.input === '\b') {
            // Backspace - remove character from command buffer
            this.terminalManager.removeFromCommandBuffer(data.terminalId);
          } else if (data.input.length === 1 && data.input >= ' ') {
            // Regular character - add to command buffer
            this.terminalManager.addToCommandBuffer(data.terminalId, data.input);
          }
        }
      });

      socket.on('ai-query', async (data) => {
        try {
          const { query, studentId, terminalId } = data;
          const suggestion = await this.terminalManager.aiTutor.analyzeTerminalActivity(
            studentId, 
            `User question: ${query}`, 
            '', 
            ''
          );
          if (suggestion) {
            socket.emit('ai-suggestion', suggestion);
          }
        } catch (error) {
          console.error('AI query error:', error);
          socket.emit('ai-suggestion', {
            type: 'error_help',
            title: '🤖 AI Assistant Unavailable',
            message: 'The AI tutor is currently unavailable. Try using manual commands like "man [command]" for help.',
            reasoning: 'Manual exploration and documentation reading are essential cybersecurity skills.'
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  async createStudentSession(studentId, courseName) {
    try {
      // Create or assign container for student (this may take time)
      console.log(`Creating session for ${studentId} in course ${courseName}`);
      const containerInfo = await this.containerManager.getOrCreateStudentContainer(studentId, courseName);
      
      // Generate session token
      const sessionToken = this.authManager.generateSessionToken(studentId, containerInfo.name);
      
      return {
        studentId,
        containerName: containerInfo.name,
        courseName,
        sessionToken,
        terminalUrl: `/terminal/${sessionToken}`,
        createdAt: new Date().toISOString(),
        message: 'Session created successfully! Container may take a moment to be ready.'
      };
    } catch (error) {
      console.error('Session creation error:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  configureAI(aiConfig) {
    try {
      console.log(`🤖 Configuring AI: ${aiConfig.provider}`);
      
      if (aiConfig.provider === 'openai') {
        process.env.OPENAI_API_KEY = aiConfig.apiKey;
        delete process.env.ANTHROPIC_API_KEY; // Clear other provider
        console.log('✅ OpenAI API key configured');
      } else if (aiConfig.provider === 'anthropic') {
        process.env.ANTHROPIC_API_KEY = aiConfig.apiKey;
        delete process.env.OPENAI_API_KEY; // Clear other provider
        console.log('✅ Anthropic API key configured');
      }
      
      // Reinitialize AI tutor with new configuration
      const AITutor = require('./lib/ai-tutor');
      this.terminalManager.aiTutor = new AITutor();
      
    } catch (error) {
      console.error('AI configuration error:', error);
    }
  }

  async saveApiKeyToEnv(provider, apiKey) {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      const envPath = path.join(__dirname, '.env');
      let envContent = await fs.readFile(envPath, 'utf8');
      
      // Update the appropriate API key
      if (provider === 'openai') {
        envContent = envContent.replace(
          /OPENAI_API_KEY=.*/,
          `OPENAI_API_KEY=${apiKey}`
        );
        // Add ANTHROPIC_API_KEY if it doesn't exist
        if (!envContent.includes('ANTHROPIC_API_KEY=')) {
          envContent += `\nANTHROPIC_API_KEY=your-anthropic-api-key-here\n`;
        }
      } else if (provider === 'anthropic') {
        // Add ANTHROPIC_API_KEY if it doesn't exist
        if (!envContent.includes('ANTHROPIC_API_KEY=')) {
          envContent += `\nANTHROPIC_API_KEY=${apiKey}\n`;
        } else {
          envContent = envContent.replace(
            /ANTHROPIC_API_KEY=.*/,
            `ANTHROPIC_API_KEY=${apiKey}`
          );
        }
      }
      
      await fs.writeFile(envPath, envContent);
      console.log(`💾 Saved ${provider} API key to .env file`);
      
      // Update current process environment
      if (provider === 'openai') {
        process.env.OPENAI_API_KEY = apiKey;
        delete process.env.ANTHROPIC_API_KEY;
      } else if (provider === 'anthropic') {
        process.env.ANTHROPIC_API_KEY = apiKey;
        delete process.env.OPENAI_API_KEY;
      }
      
      // Reinitialize AI tutor with new API key
      const AITutor = require('./lib/ai-tutor');
      this.terminalManager.aiTutor = new AITutor();
      console.log(`🔄 AI Tutor reinitialized with ${provider} configuration`);
      
    } catch (error) {
      console.error('Error saving API key to .env:', error);
      throw error;
    }
  }

  start(port = 3000) {
    this.server.listen(port, () => {
      console.log(`🚀 HAX AI Warp Server running on port ${port}`);
      console.log(`📱 Interface: http://localhost:${port}`);
      console.log(`🔧 API: http://localhost:${port}/api`);
    });
  }
}

// Start server
const server = new HaxAIWarpServer();
server.start(process.env.PORT || 3000);

module.exports = HaxAIWarpServer;
