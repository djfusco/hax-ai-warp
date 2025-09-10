class HaxAIWarpClient {
  constructor() {
    this.socket = null;
    this.terminal = null;
    this.fitAddon = null;
    this.currentSession = null;
    this.sessionStartTime = null;
    
    this.initializeApp();
  }

  initializeApp() {
    this.setupEventListeners();
    this.updateConnectionStatus('disconnected');
    
    // Initialize AI provider display
    const aiProvider = document.getElementById('ai-provider');
    if (aiProvider) {
      console.log('🚀 Initializing AI provider with value:', aiProvider.value);
      this.handleAIProviderChange(aiProvider.value);
    } else {
      console.error('❌ Could not find ai-provider element during initialization');
    }
    
    // Check for instructor mode
    if (window.location.search.includes('instructor=true')) {
      this.showInstructorPanel();
    }
  }

  setupEventListeners() {
    // Student form submission
    document.getElementById('student-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createStudentSession();
    });

    // AI Configuration
    const aiProviderSelect = document.getElementById('ai-provider');
    if (aiProviderSelect) {
      console.log('🎛️ Setting up AI provider change listener');
      const self = this;
      aiProviderSelect.addEventListener('change', function(e) {
        console.log('🔄 AI provider dropdown changed to:', e.target.value);
        self.handleAIProviderChange(e.target.value);
      });
    } else {
      console.error('❌ Could not find ai-provider select element');
    }

    // Terminal controls
    document.getElementById('clear-terminal')?.addEventListener('click', () => {
      this.terminal?.clear();
    });

    document.getElementById('reset-vm')?.addEventListener('click', () => {
      this.resetVM();
    });

    document.getElementById('disconnect')?.addEventListener('click', () => {
      this.disconnect();
    });

    // AI Assistant
    document.getElementById('ask-ai')?.addEventListener('click', () => {
      this.askAI();
    });

    document.getElementById('ai-query')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.askAI();
      }
    });

    // Instructor controls
    document.getElementById('show-all-sessions')?.addEventListener('click', () => {
      this.loadAllSessions();
    });

    document.getElementById('create-demo-vm')?.addEventListener('click', () => {
      this.createDemoVM();
    });

    document.getElementById('cleanup-vms')?.addEventListener('click', () => {
      this.cleanupVMs();
    });
  }

  async createStudentSession() {
    const studentId = document.getElementById('student-id').value;
    const courseName = document.getElementById('course-name').value;
    const aiProvider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('api-key').value;

    if (!studentId || !courseName) {
      this.showError('Please fill in all fields');
      return;
    }

    // Validate API key if needed
    if ((aiProvider === 'openai' || aiProvider === 'anthropic') && !apiKey) {
      this.showError('API key is required for ' + aiProvider.toUpperCase());
      return;
    }

    this.updateConnectionStatus('connecting');

    try {
      // Save API key if provided
      if ((aiProvider === 'openai' || aiProvider === 'anthropic') && apiKey) {
        await this.saveApiKey(aiProvider, apiKey);
      }

      const sessionData = { 
        studentId, 
        courseName,
        aiConfig: {
          provider: aiProvider,
          apiKey: apiKey || null
        }
      };

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

      const result = await response.json();

      if (result.success) {
        this.currentSession = result.session;
        this.sessionStartTime = new Date();
        this.startSessionTimer();
        this.connectToTerminal();
        this.showTerminalSection();
        this.updateSessionInfo();
      } else {
        this.showError('Failed to create session: ' + result.error);
      }
    } catch (error) {
      this.showError('Connection failed: ' + error.message);
      this.updateConnectionStatus('disconnected');
    }
  }

  connectToTerminal() {
    this.socket = io();

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.updateConnectionStatus('connected');
      this.initializeTerminal();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.updateConnectionStatus('disconnected');
    });

    this.socket.on('terminal-created', (data) => {
      console.log('Terminal created:', data.terminalId);
      this.setupTerminalHandlers(data.terminalId);
    });

    this.socket.on('terminal-output', (data) => {
      if (this.terminal) {
        this.terminal.write(data.output);
      }
    });

    this.socket.on('ai-suggestion', (suggestion) => {
      console.log('🤖 Received AI suggestion:', suggestion);
      this.displayAISuggestion(suggestion);
    });

    this.socket.on('error', (error) => {
      this.showError('Terminal error: ' + error.message);
    });
  }

  initializeTerminal() {
    // Initialize xterm.js terminal
    this.terminal = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selection: '#ffffff20'
      },
      fontFamily: 'SF Mono, Monaco, Cascadia Code, monospace',
      fontSize: 14,
      rows: 30,
      cols: 100
    });

    this.fitAddon = new FitAddon.FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    const container = document.getElementById('terminal-container');
    this.terminal.open(container);
    this.fitAddon.fit();

    // Handle terminal input
    this.terminal.onData((data) => {
      if (this.socket && this.currentTerminalId) {
        this.socket.emit('terminal-input', {
          terminalId: this.currentTerminalId,
          input: data
        });
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.fitAddon?.fit();
    });

    // Request terminal creation
    this.socket.emit('create-terminal', {
      studentId: this.currentSession.studentId,
      courseName: this.currentSession.courseName
    });
  }

  setupTerminalHandlers(terminalId) {
    this.currentTerminalId = terminalId;
    
    // Welcome message
    const welcomeMsg = `\r\n🚀 Welcome to HAX AI Warp Linux Sandbox!\r\n`;
    const infoMsg = `Student: ${this.currentSession.studentId} | VM: ${this.currentSession.vmId}\r\n`;
    const helpMsg = `Type 'help' for available commands, or just start experimenting!\r\n\r\n`;
    
    this.terminal.write(welcomeMsg + infoMsg + helpMsg);
  }

  showTerminalSection() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('terminal-section').classList.remove('hidden');
  }

  updateSessionInfo() {
    const containerName = this.currentSession.containerName || 'local';
    const info = `Student: ${this.currentSession.studentId} | Course: ${this.currentSession.courseName} | Environment: ${containerName}`;
    document.getElementById('session-info').textContent = info;
  }

  updateConnectionStatus(status) {
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = `status-value ${status}`;
  }

  startSessionTimer() {
    setInterval(() => {
      if (this.sessionStartTime) {
        const elapsed = new Date() - this.sessionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('session-time').textContent = timeStr;
      }
    }, 1000);
  }

  displayAISuggestion(suggestion) {
    const suggestionsDiv = document.getElementById('ai-suggestions');
    const timestamp = new Date().toLocaleTimeString();
    
    const typeIcons = {
      'error_help': '🚨',
      'guidance': '💡',
      'learning_tip': '📚',
      'next_steps': '🎯',
      'install_help': '📦'
    };
    
    const icon = typeIcons[suggestion.type] || '💭';
    
    const suggestionHTML = `
      <div class="ai-suggestion ${suggestion.type}" style="margin-bottom: 15px; padding: 12px; border-left: 4px solid #3498db; background: #f8f9fa; border-radius: 4px;">
        <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">
          ${icon} ${suggestion.title} <span style="font-size: 0.8em; color: #7f8c8d; float: right;">${timestamp}</span>
        </div>
        <div style="color: #34495e; margin-bottom: 8px;">${suggestion.message}</div>
        ${suggestion.suggestion ? `<div style="background: #2c3e50; color: #f39c12; padding: 8px; border-radius: 3px; font-family: monospace; font-size: 0.9em; margin-bottom: 5px;">${suggestion.suggestion}</div>` : ''}
        <div style="font-size: 0.85em; color: #7f8c8d; font-style: italic;">${suggestion.reasoning}</div>
      </div>
    `;
    
    suggestionsDiv.innerHTML = suggestionHTML + suggestionsDiv.innerHTML;
    
    // Keep only last 5 suggestions to avoid clutter
    const suggestions = suggestionsDiv.children;
    while (suggestions.length > 5) {
      suggestionsDiv.removeChild(suggestions[suggestions.length - 1]);
    }
    
    // Auto-scroll to latest suggestion
    suggestionsDiv.scrollTop = 0;
  }

  async askAI() {
    const query = document.getElementById('ai-query').value;
    if (!query) return;

    const suggestionsDiv = document.getElementById('ai-suggestions');
    
    // Show that we're processing the question
    this.displayAISuggestion({
      type: 'guidance',
      title: '🤔 Analyzing Your Question',
      message: `Processing: "${query}"...`,
      reasoning: 'Let me think about this in the context of your current session.'
    });

    // Send to backend for AI processing
    if (this.socket) {
      this.socket.emit('ai-query', {
        query: query,
        studentId: this.currentSession?.studentId,
        terminalId: this.currentTerminalId
      });
    }

    // Clear input
    document.getElementById('ai-query').value = '';
  }

  async resetVM() {
    if (!confirm('Are you sure you want to reset your VM? All unsaved work will be lost.')) {
      return;
    }

    try {
      // Implementation would call API to reset VM
      this.showSuccess('VM reset initiated. This may take a few moments...');
    } catch (error) {
      this.showError('Failed to reset VM: ' + error.message);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    document.getElementById('terminal-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    
    this.currentSession = null;
    this.sessionStartTime = null;
    this.updateConnectionStatus('disconnected');
  }

  showInstructorPanel() {
    document.getElementById('instructor-panel').classList.remove('hidden');
  }

  async loadAllSessions() {
    try {
      // Implementation would fetch active sessions
      const sessionsList = document.getElementById('sessions-list');
      sessionsList.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666;">
          Loading active sessions...
        </div>
      `;
      
      // Simulate loading
      setTimeout(() => {
        sessionsList.innerHTML = `
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <strong>student123</strong> - cs101-student123 - Active 45min
          </div>
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <strong>student456</strong> - webdev-student456 - Active 1h 20min
          </div>
        `;
      }, 1000);
    } catch (error) {
      this.showError('Failed to load sessions: ' + error.message);
    }
  }

  async createDemoVM() {
    this.showSuccess('Creating demo VM... This will take a few minutes.');
  }

  async cleanupVMs() {
    if (!confirm('This will delete all inactive VMs. Continue?')) {
      return;
    }
    this.showSuccess('Cleanup initiated...');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type) {
    // Create simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      max-width: 400px;
      background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  handleAIProviderChange(provider) {
    console.log('🔧 AI Provider changed to:', provider);
    
    const apiKeyGroup = document.getElementById('api-key-group');
    const apiHelpText = document.getElementById('api-help-text');
    const apiHelpLink = document.getElementById('api-help-link');
    const modeDescription = document.getElementById('ai-mode-description');

    console.log('🔍 Found elements:', {
      apiKeyGroup: !!apiKeyGroup,
      apiHelpText: !!apiHelpText,
      apiHelpLink: !!apiHelpLink,
      modeDescription: !!modeDescription
    });

    if (provider === 'pattern-matching') {
      console.log('📝 Setting pattern-matching mode');
      if (apiKeyGroup) apiKeyGroup.style.display = 'none';
      if (modeDescription) modeDescription.textContent = 'Pattern matching mode provides built-in cybersecurity guidance without requiring an API key.';
    } else if (provider === 'openai') {
      console.log('📝 Setting OpenAI mode');
      if (apiKeyGroup) apiKeyGroup.style.display = 'block';
      if (apiHelpText) apiHelpText.textContent = 'Get your OpenAI API key from platform.openai.com';
      if (apiHelpLink) {
        apiHelpLink.href = 'https://platform.openai.com/api-keys';
        apiHelpLink.textContent = 'Get OpenAI API Key';
      }
      if (modeDescription) modeDescription.textContent = 'OpenAI mode provides advanced AI-powered assistance with context-aware responses and personalized learning guidance.';
    } else if (provider === 'anthropic') {
      console.log('📝 Setting Anthropic mode');
      if (apiKeyGroup) apiKeyGroup.style.display = 'block';
      if (apiHelpText) apiHelpText.textContent = 'Get your Anthropic API key from console.anthropic.com';
      if (apiHelpLink) {
        apiHelpLink.href = 'https://console.anthropic.com/';
        apiHelpLink.textContent = 'Get Anthropic API Key';
      }
      if (modeDescription) modeDescription.textContent = 'Anthropic Claude mode provides intelligent AI assistance with detailed explanations and educational focus.';
    }
    
    console.log('✅ AI Provider change complete');
  }

  async saveApiKey(provider, apiKey) {
    try {
      console.log(`💾 Saving ${provider} API key`);
      const response = await fetch('/api/save-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, apiKey })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${provider} API key saved successfully`);
        this.showNotification(`${provider.toUpperCase()} API key saved for future sessions`, 'success');
      } else {
        console.error('Failed to save API key:', result.error);
      }
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      max-width: 400px;
      background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new HaxAIWarpClient();
});
