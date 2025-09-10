const pty = require('node-pty');
const os = require('os');
const fs = require('fs');
const path = require('path');
const DockerContainerManager = require('./docker-container-manager');
const AITutor = require('./ai-tutor');

class TerminalManager {
  constructor() {
    this.terminals = new Map();
    this.containerManager = new DockerContainerManager();
    this.aiTutor = new AITutor();
    this.io = null; // Will be set by server
    
    // Track terminal activity for AI analysis
    this.terminalBuffers = new Map();
    this.lastCommands = new Map();
    this.currentCommandBuffers = new Map(); // Track commands as they're being typed
  }

  setSocketIO(io) {
    this.io = io;
  }

  async createTerminal(studentId, courseName) {
    const { v4: uuidv4 } = await import('uuid');
    const terminalId = uuidv4();
    
    try {
      console.log(`Creating Docker terminal for student: ${studentId}, course: ${courseName}`);
      
      // Get or create Docker container for student
      this.broadcastToTerminal(terminalId, 'output', 'Preparing your cybersecurity lab environment...\r\n');
      const containerInfo = await this.containerManager.getOrCreateStudentContainer(studentId, courseName);
      
      this.broadcastToTerminal(terminalId, 'output', `Container ready: ${containerInfo.name}\r\n`);
      this.broadcastToTerminal(terminalId, 'output', 'Connecting to your lab environment...\r\n\r\n');

      // Create SSH connection to container
      const sshCommand = [
        '-o', 'StrictHostKeyChecking=no',
        '-o', 'UserKnownHostsFile=/dev/null',
        '-p', containerInfo.sshPort.toString(),
        'student@localhost'
      ];

      const terminal = pty.spawn('ssh', sshCommand, {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        env: process.env
      });

      this.terminals.set(terminalId, { 
        id: terminalId,
        studentId,
        courseName,
        terminal, 
        containerName: containerInfo.name,
        createdAt: new Date()
      });

      // Handle terminal data with AI monitoring
      terminal.on('data', (data) => {
        this.broadcastToTerminal(terminalId, 'output', data);
        this.processTerminalOutput(terminalId, studentId, data);
      });

      // Handle terminal exit
      terminal.on('exit', () => {
        this.terminals.delete(terminalId);
        this.broadcastToTerminal(terminalId, 'exit');
      });

      // Send connection welcome
      this.broadcastToTerminal(terminalId, 'output', `🔐 HAX AI Cybersecurity Lab\r\nStudent: ${studentId} | Course: ${courseName}\r\nContainer: ${containerInfo.name}\r\n\r\n🔑 PASSWORD: haxwarp123\r\n(Enter this password when prompted)\r\n\r\n`);
      
      return { id: terminalId };
    } catch (error) {
      console.error('Failed to create container terminal:', error);
      this.broadcastToTerminal(terminalId, 'output', `❌ Failed to create lab environment: ${error.message}\r\n`);
      this.broadcastToTerminal(terminalId, 'output', 'Falling back to local terminal...\r\n\r\n');
      
      // Fallback to local terminal
      return this.createLocalTerminal(studentId, courseName, terminalId);
    }
  }

  createLocalTerminal(studentId, courseName, terminalId) {
    // Create student-specific directory for fallback
    const baseDir = '/tmp/hax-ai-warp';
    const studentDir = path.join(baseDir, courseName, studentId);
    
    if (!fs.existsSync(studentDir)) {
      fs.mkdirSync(studentDir, { recursive: true });
    }

    // Create welcome file
    fs.writeFileSync(`${studentDir}/welcome.txt`, 
      `Welcome to HAX AI Warp!
Student: ${studentId}
Course: ${courseName}

Try these commands:
- ls (list files)
- pwd (show current directory)
- whoami (show current user)
- echo "hello world" (print text)
- nano welcome.txt (edit this file)
- mkdir myproject (create directory)
- cd myproject (change directory)
- touch myfile.txt (create empty file)
`
    );

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const terminal = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: studentDir,
      env: {
        ...process.env,
        PS1: `[${studentId}@hax-warp \\W]$ `,
        HOME: studentDir
      }
    });

    this.terminals.set(terminalId, { 
      id: terminalId,
      studentId,
      courseName,
      terminal, 
      containerName: null,
      isLocal: true,
      createdAt: new Date()
    });

    // Handle terminal data
    terminal.on('data', (data) => {
      this.broadcastToTerminal(terminalId, 'output', data);
    });

    // Handle terminal exit
    terminal.on('exit', () => {
      this.terminals.delete(terminalId);
      this.broadcastToTerminal(terminalId, 'exit');
    });

    // Send fallback welcome
    setTimeout(() => {
      terminal.write(`\r\n⚠️  Local Terminal Mode\r\n`);
      terminal.write(`Student: ${studentId} | Course: ${courseName}\r\n`);
      terminal.write(`Directory: ${studentDir}\r\n`);
      terminal.write(`Type 'cat welcome.txt' to see available commands\r\n\r\n`);
    }, 100);
    
    return { id: terminalId };
  }

  sendInput(terminalId, input) {
    const terminalSession = this.terminals.get(terminalId);
    if (terminalSession) {
      terminalSession.terminal.write(input);
      
      // Track commands for AI analysis
      if (input.includes('\r') || input.includes('\n')) {
        const studentId = terminalSession.studentId;
        this.processCommand(terminalId, studentId, input.trim());
      }
    }
  }

  async processTerminalOutput(terminalId, studentId, data) {
    // Debug logging
    console.log(`🔍 AI Tutor processing output for ${studentId}:`, data.substring(0, 100));
    
    // Buffer terminal output for analysis
    if (!this.terminalBuffers.has(terminalId)) {
      this.terminalBuffers.set(terminalId, { output: '', error: '', lastUpdate: Date.now() });
    }
    
    const buffer = this.terminalBuffers.get(terminalId);
    buffer.output += data;
    buffer.lastUpdate = Date.now();
    
    // Check for errors immediately
    const hasError = data.toLowerCase().includes('error') || data.toLowerCase().includes('invalid') || 
                    data.toLowerCase().includes('unrecognized') || data.toLowerCase().includes('failed') || 
                    data.toLowerCase().includes('quitting') || data.toLowerCase().includes('not found');
    
    // Check for prompt return
    const hasPrompt = data.includes('$') || data.includes('#') || data.includes('>');
    
    console.log(`🔍 Trigger check - hasError: ${hasError}, hasPrompt: ${hasPrompt}, data: "${data.substring(0, 50)}"`);
    
    // ALWAYS trigger analysis when we see errors or prompts
    if (hasPrompt || hasError) {
      console.log(`🚀 TRIGGERING AI analysis for ${studentId} - terminalId: ${terminalId}`);
      setTimeout(() => {
        console.log(`⏰ Executing delayed AI analysis for ${studentId}`);
        this.analyzeRecentActivity(terminalId, studentId);
      }, 500);
    }
  }

  async processCommand(terminalId, studentId, command) {
    // Store the command for analysis
    this.lastCommands.set(terminalId, {
      command: command.replace(/\r|\n/g, ''),
      timestamp: Date.now()
    });
  }

  addToCommandBuffer(terminalId, char) {
    if (!this.currentCommandBuffers.has(terminalId)) {
      this.currentCommandBuffers.set(terminalId, '');
    }
    const current = this.currentCommandBuffers.get(terminalId);
    this.currentCommandBuffers.set(terminalId, current + char);
  }

  removeFromCommandBuffer(terminalId) {
    if (!this.currentCommandBuffers.has(terminalId)) return;
    const current = this.currentCommandBuffers.get(terminalId);
    if (current.length > 0) {
      this.currentCommandBuffers.set(terminalId, current.slice(0, -1));
    }
  }

  finalizeCommand(terminalId, studentId) {
    const command = this.currentCommandBuffers.get(terminalId) || '';
    if (command.trim()) {
      console.log(`📝 Command executed: "${command.trim()}"`);
      this.processCommand(terminalId, studentId, command.trim());
    }
    // Clear the command buffer
    this.currentCommandBuffers.set(terminalId, '');
  }

  async analyzeRecentActivity(terminalId, studentId) {
    try {
      const buffer = this.terminalBuffers.get(terminalId);
      const lastCommand = this.lastCommands.get(terminalId);
      
      if (!buffer) {
        console.log(`🤖 No buffer found for terminal ${terminalId}`);
        return;
      }
      
      // Don't analyze too frequently
      if (Date.now() - buffer.lastUpdate < 500) return;
      
      let command = '';
      let output = buffer.output;
      
      // Try to get command from stored command
      if (lastCommand && lastCommand.command) {
        command = lastCommand.command;
      } else {
        // Fallback: try to extract from recent output
        const lines = output.split('\n');
        for (const line of lines.reverse()) {
          if (line.includes('$') && line.length > 10) {
            const parts = line.split('$');
            if (parts.length > 1) {
              command = parts[1].trim();
              break;
            }
          }
        }
      }
      
      console.log(`🔍 Analyzing activity - Command: "${command}", Output length: ${output.length}`);
      
      // Detect if this looks like an error
      const errorOutput = this.extractErrors(output);
      
      // Always try to get AI analysis if we have any data
      if (command || output.length > 50 || errorOutput) {
        const suggestion = await this.aiTutor.analyzeTerminalActivity(
          studentId, 
          command || 'unknown command', 
          output, 
          errorOutput
        );
        
        if (suggestion) {
          console.log(`🤖 Sending AI suggestion to terminal ${terminalId}:`, suggestion.title);
          // Send AI suggestion to frontend
          this.broadcastToTerminal(terminalId, 'ai-suggestion', suggestion);
        } else {
          console.log(`🤖 No AI suggestion generated for terminal ${terminalId}`);
        }
      }
      
      // Clear buffer after analysis
      this.terminalBuffers.set(terminalId, { output: '', error: '', lastUpdate: Date.now() });
      
    } catch (error) {
      console.error('AI analysis error:', error);
    }
  }

  extractErrors(output) {
    const errorPatterns = [
      // General errors
      /.*error.*/gi,
      /.*failed.*/gi,
      /.*permission denied.*/gi,
      /.*command not found.*/gi,
      /.*no such file.*/gi,
      /.*connection refused.*/gi,
      /.*invalid.*/gi,
      /.*cannot.*/gi,
      /.*unable.*/gi,
      
      // Tool-specific errors
      /.*quitting.*/gi,           // nmap, other tools
      /.*usage:.*/gi,             // usage messages (often indicate errors)
      /.*unknown option.*/gi,     // option errors
      /.*bad argument.*/gi,       // argument errors
      /.*syntax error.*/gi,       // syntax issues
      /.*not found.*/gi,          // general not found
      /.*timeout.*/gi,            // timeout errors
      /.*refused.*/gi,            // connection refused
      
      // Network/service errors
      /.*unreachable.*/gi,
      /.*no route.*/gi,
      /.*connection timed out.*/gi,
      
      // Authentication errors
      /.*authentication failed.*/gi,
      /.*access denied.*/gi,
      /.*unauthorized.*/gi
    ];
    
    const errors = [];
    for (const pattern of errorPatterns) {
      const matches = output.match(pattern);
      if (matches) {
        errors.push(...matches);
      }
    }
    
    return errors.join('\n');
  }

  broadcastToTerminal(terminalId, event, data) {
    if (this.io) {
      if (event === 'ai-suggestion') {
        // Emit AI suggestion to all clients in this terminal room
        this.io.to(`terminal-${terminalId}`).emit('ai-suggestion', data);
      } else {
        // Default: emit as terminal output
        this.io.to(`terminal-${terminalId}`).emit('terminal-output', { output: data });
      }
    }
  }

  closeTerminal(terminalId) {
    const terminalSession = this.terminals.get(terminalId);
    if (terminalSession) {
      terminalSession.terminal.destroy();
      this.terminals.delete(terminalId);
    }
  }

  getActiveTerminals() {
    return Array.from(this.terminals.values()).map(session => ({
      id: session.id,
      studentId: session.studentId,
      courseName: session.courseName,
      containerName: session.containerName,
      isLocal: session.isLocal || false,
      createdAt: session.createdAt
    }));
  }
}

module.exports = TerminalManager;
