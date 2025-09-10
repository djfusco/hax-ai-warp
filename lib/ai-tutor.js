class AITutor {
  constructor() {
    // Initialize AI providers
    this.openaiEnabled = false;
    this.anthropicEnabled = false;
    this.aiProvider = 'pattern-matching';
    
    // Try OpenAI first
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const OpenAI = require('openai');
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.openaiEnabled = true;
        this.aiProvider = 'openai';
        console.log('🤖 AI Tutor: OpenAI integration enabled - Full Warp.dev-like AI features active');
      } catch (error) {
        console.log('⚠️ AI Tutor: OpenAI package not found. Install with: npm install openai');
      }
    }
    
    // Try Anthropic if OpenAI not available
    if (!this.openaiEnabled && process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key-here') {
      try {
        const Anthropic = require('@anthropic-ai/sdk');
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.anthropicEnabled = true;
        this.aiProvider = 'anthropic';
        console.log('🤖 AI Tutor: Anthropic integration enabled - Full Warp.dev-like AI features active');
      } catch (error) {
        console.log('⚠️ AI Tutor: Anthropic package not found. Install with: npm install @anthropic-ai/sdk');
      }
    }
    
    if (!this.openaiEnabled && !this.anthropicEnabled) {
      console.log('🤖 AI Tutor: Running in pattern-matching mode');
      console.log('💡 For full Warp.dev-like AI features, set OPENAI_API_KEY or ANTHROPIC_API_KEY');
      console.log('📦 Install AI packages: npm install openai @anthropic-ai/sdk');
    }
    
    // Track session context
    this.sessionContext = new Map();
    this.commandHistory = new Map();
    this.currentTasks = new Map();
    
    // Cybersecurity-specific knowledge base
    this.knowledgeBase = {
      nmap: {
        common_errors: ['permission denied', 'host unreachable'],
        hints: ['Use sudo for privileged scans', 'Check target is reachable with ping first'],
        next_steps: ['Try -sV for version detection', 'Use -p to specify ports']
      },
      apache: {
        config_files: ['/etc/apache2/apache2.conf', '/etc/apache2/sites-available/'],
        common_issues: ['port already in use', 'permission denied', 'syntax error'],
        debugging: ['Check apache2 status', 'Review error logs in /var/log/apache2/']
      },
      john: {
        usage: ['john hashfile.txt', 'john --wordlist=rockyou.txt hashfile.txt'],
        formats: ['Use --format= to specify hash type', 'List formats with --list=formats']
      },
      metasploit: {
        workflow: ['msfconsole', 'search exploit', 'use exploit', 'set options', 'exploit'],
        common_commands: ['search', 'use', 'show options', 'set', 'exploit', 'sessions']
      }
    };
  }

    // Analyze terminal input and provide context-aware suggestions
  async analyzeTerminalActivity(studentId, command, output, errorOutput) {
    try {
      const sessionId = `session_${studentId}`;
      
      // Update command history
      if (!this.commandHistory.has(sessionId)) {
        this.commandHistory.set(sessionId, []);
      }
      
      const history = this.commandHistory.get(sessionId);
      history.push({
        command,
        output,
        error: errorOutput,
        timestamp: Date.now()
      });
      
      // Keep only last 15 commands for context (like Warp)
      if (history.length > 15) {
        history.shift();
      }
      
      // Always provide analysis - like Warp.dev does
      const analysis = await this.performWarpLikeAnalysis(sessionId, command, output, errorOutput, history);
      
      return analysis;
    } catch (error) {
      console.error('AI Tutor analysis error:', error);
      return this.getFallbackSuggestion(command, output, errorOutput);
    }
  }

  // Warp.dev-like comprehensive analysis
  async performWarpLikeAnalysis(sessionId, command, output, errorOutput, history) {
    // Use AI if available, otherwise enhanced pattern matching
    if (this.openaiEnabled || this.anthropicEnabled) {
      return await this.getAIBasedAnalysis(command, output, errorOutput, history);
    } else {
      return this.getEnhancedPatternAnalysis(command, output, errorOutput, history);
    }
  }

  // AI-powered analysis (like Warp.dev)
  async getAIBasedAnalysis(command, output, errorOutput, history) {
    try {
      const context = this.buildContext(command, output, errorOutput, history);
      const prompt = this.buildWarpLikePrompt(context);
      
      let aiResponse;
      
      if (this.openaiEnabled) {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a terminal AI assistant (like Warp.dev). Provide brief, practical suggestions only. Keep responses under 25 words. Focus on immediate fixes or next commands.`
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        });
        aiResponse = completion.choices[0].message.content;
      } else if (this.anthropicEnabled) {
        const completion = await this.anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          system: `You are a terminal AI assistant (like Warp.dev). Provide brief, practical suggestions only. Keep responses under 25 words. Focus on immediate fixes or next commands.`
        });
        aiResponse = completion.content[0].text;
      }
      
      return this.formatAIResponse(aiResponse, command);
      
    } catch (error) {
      console.error('AI API error:', error);
      return this.getEnhancedPatternAnalysis(command, output, errorOutput, history);
    }
  }

  async performContextAnalysis(sessionId, command, output, errorOutput) {
    const history = this.commandHistory.get(sessionId) || [];
    const recentCommands = history.slice(-3).map(h => h.command).join('; ');
    
    // Quick pattern matching for immediate help
    const quickHelp = this.getQuickHelp(command, output, errorOutput);
    if (quickHelp) {
      return quickHelp;
    }
    
    // Use AI for complex analysis
    const context = {
      currentCommand: command,
      recentCommands,
      output: output?.substring(0, 500), // Limit for API
      error: errorOutput?.substring(0, 300),
      environment: 'cybersecurity lab'
    };
    
    const aiSuggestion = await this.getAISuggestion(context);
    return aiSuggestion;
  }

  getQuickHelp(command, output, errorOutput) {
    const cmd = command.toLowerCase().trim();
    const fullOutput = (output + ' ' + errorOutput).toLowerCase();
    
    // Basic command suggestions
    if (cmd === 'ls') {
      return {
        type: 'next_steps',
        title: '📂 Directory listing',
        message: 'Basic file listing complete.',
        suggestion: 'ls -latr (detailed + time sorted) or ls -lah (with sizes)',
        reasoning: 'Shows permissions, ownership, timestamps, and hidden files'
      };
    }
    
    if (cmd === 'df') {
      return {
        type: 'next_steps',
        title: '💾 Disk space',
        message: 'Disk usage displayed.',
        suggestion: 'df -h (human readable) or df -i (inodes)',
        reasoning: 'Shows space in GB/MB format or file count limits'
      };
    }
    
    if (cmd.startsWith('cd ')) {
      return {
        type: 'next_steps',
        title: '📁 Directory changed',
        message: 'Directory navigation complete.',
        suggestion: 'pwd (show location) or ls -la (list contents)',
        reasoning: 'Confirm location and explore new directory'
      };
    }
    
    // Nmap-specific errors
    if (cmd.includes('nmap')) {
      if (fullOutput.includes('invalid argument') || fullOutput.includes('quitting')) {
        return {
          type: 'error_help',
          title: '🎯 Invalid nmap syntax',
          message: 'Invalid nmap flags detected.',
          suggestion: 'nmap -sS [target] (SYN scan) or nmap -sV [target] (version scan)',
          reasoning: 'Nmap flags are case-sensitive'
        };
      }
    }
    
    // Permission denied scenarios
    if (errorOutput?.includes('Permission denied')) {
      if (cmd.includes('nmap') || cmd.includes('tcpdump')) {
        return {
          type: 'error_help',
          title: '🔒 Need sudo',
          message: `Try: sudo ${command}`,
          suggestion: 'Network tools require root privileges',
          reasoning: 'Security restriction'
        };
      }
      
      if (cmd.includes('apache') || cmd.includes('systemctl')) {
        return {
          type: 'error_help',
          title: '🔒 Need sudo',
          message: `Try: sudo ${command}`,
          suggestion: 'Service management requires admin rights',
          reasoning: 'System security'
        };
      }
    }
    
    // Command not found
    if (errorOutput?.includes('command not found')) {
      const missingCmd = cmd.split(' ')[0];
      const suggestions = this.getSoftwareInstallSuggestions(missingCmd);
      if (suggestions) {
        return {
          type: 'install_help',
          title: '📦 Tool missing',
          message: `Install: ${suggestions.install}`,
          suggestion: suggestions.install,
          reasoning: suggestions.reason
        };
      }
    }
    
    // Successful command patterns
    if (cmd.startsWith('nmap') && output?.includes('open')) {
      return {
        type: 'next_steps',
        title: '🎯 Open ports discovered',
        message: 'Found open services on target.',
        suggestion: 'nmap -sV -sC [target] (version + script scan)',
        reasoning: 'Identify service versions and run default scripts'
      };
    }
    
    if (cmd.includes('john') && output?.includes('Loaded')) {
      return {
        type: 'next_steps',
        title: '🔓 Hashes loaded',
        message: 'Ready for password cracking.',
        suggestion: 'john --wordlist=/usr/share/wordlists/rockyou.txt [hashfile]',
        reasoning: 'Dictionary attacks are most effective first step'
      };
    }
    
    if (cmd === 'whoami') {
      return {
        type: 'next_steps',
        title: '👤 User identity',
        message: 'Current user identified.',
        suggestion: 'id (detailed user info) or sudo -l (check sudo permissions)',
        reasoning: 'Understand user privileges and group memberships'
      };
    }
    
    if (cmd === 'pwd') {
      return {
        type: 'next_steps',
        title: '📍 Current location',
        message: 'Working directory displayed.',
        suggestion: 'ls -la (list contents) or cd .. (go up one level)',
        reasoning: 'Explore current directory or navigate filesystem'
      };
    }
    
    return null;
  }

  getSoftwareInstallSuggestions(command) {
    const installMap = {
      'wireshark': {
        install: 'sudo apt install wireshark',
        reason: 'Network analyzer'
      },
      'metasploit': {
        install: 'Try: msfconsole',
        reason: 'Already installed'
      },
      'sqlmap': {
        install: 'sudo apt install sqlmap',
        reason: 'SQL injection tool'
      },
      'nikto': {
        install: 'sudo apt install nikto',
        reason: 'Web scanner'
      }
    };
    
    return installMap[command] || null;
  }

  async getAISuggestion(context) {
    // Try OpenAI if available
    if (this.openaiEnabled) {
      try {
        const prompt = `Terminal AI: You help with commands briefly.

Command: ${context.currentCommand}
${context.error ? `Error: ${context.error}` : ''}

Give a 1-2 sentence response with:
- What's wrong (if error)
- Suggested fix command

No motivational text. Be direct and practical.`;

        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 50
        });

        const response = completion.choices[0].message.content;
        return {
          type: 'ai_help',
          title: '🤖 Quick Fix',
          message: response.trim(),
          suggestion: this.extractSuggestion(response),
          reasoning: 'AI suggestion'
        };
      } catch (error) {
        console.error('OpenAI API error:', error);
      }
    }
    
    // Fallback to pattern-based help
    return this.getPatternBasedSuggestion(context);
  }

  getPatternBasedSuggestion(context) {
    const cmd = context.currentCommand.toLowerCase();
    
    // Command-specific contextual tips
    if (cmd.includes('nmap')) {
      return {
        type: 'tip',
        title: '🎯 Nmap scanning',
        message: 'Network reconnaissance in progress.',
        suggestion: 'nmap -sV -sC -O [target] (comprehensive scan)',
        reasoning: 'Combines version detection, scripts, and OS fingerprinting'
      };
    }
    
    if (cmd.includes('john')) {
      return {
        type: 'tip',
        title: '🔓 Password analysis',
        message: 'Hash cracking tool ready.',
        suggestion: 'john --show [hashfile] (view cracked passwords)',
        reasoning: 'Display previously cracked passwords from this session'
      };
    }
    
    if (cmd.includes('apache') || cmd.includes('nginx')) {
      return {
        type: 'tip',
        title: '🌐 Web server',
        message: 'Web service management.',
        suggestion: 'systemctl status apache2 (check service status)',
        reasoning: 'Verify if web server is running and configured'
      };
    }
    
    if (cmd.includes('msfconsole')) {
      return {
        type: 'tip',
        title: '🎯 Metasploit framework',
        message: 'Exploitation framework loaded.',
        suggestion: 'search [vulnerability] or use [exploit_path]',
        reasoning: 'Find exploits for discovered vulnerabilities'
      };
    }
    
    return {
      type: 'tip',
      title: '💡 Command help',
      message: 'Exploring cybersecurity tools.',
      suggestion: 'man [command] (detailed manual) or [command] --help',
      reasoning: 'Learn command options and usage examples'
    };
  }

  // Track what the student seems to be working on
  detectCurrentTask(command, history) {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('nmap')) return 'network_scanning';
    if (cmd.includes('john') || cmd.includes('hashcat')) return 'password_cracking';
    if (cmd.includes('apache') || cmd.includes('nginx')) return 'web_server_setup';
    if (cmd.includes('wireshark') || cmd.includes('tcpdump')) return 'network_analysis';
    if (cmd.includes('msfconsole') || cmd.includes('exploit')) return 'penetration_testing';
    
    return 'general_exploration';
  }

  // Build context for AI analysis (Warp.dev style)
  buildContext(command, output, errorOutput, history) {
    const recentCommands = history.slice(-5).map(h => `${h.command} -> ${h.error ? 'ERROR' : 'OK'}`).join('\n');
    
    return {
      currentCommand: command,
      output: output?.substring(0, 800) || '',
      error: errorOutput?.substring(0, 400) || '',
      recentHistory: recentCommands,
      environment: 'cybersecurity lab with tools like nmap, john, metasploit, apache'
    };
  }

  // Build Warp.dev-like prompt
  buildWarpLikePrompt(context) {
    return `Command: ${context.currentCommand}
${context.error ? `Error: ${context.error}` : ''}

Brief fix or next step (under 25 words):`;
  }

  // Format AI response consistently
  formatAIResponse(aiResponse, command) {
    return {
      type: 'ai_analysis',
      title: '🤖 AI Assistant',
      message: aiResponse.trim(),
      suggestion: this.extractSuggestion(aiResponse),
      reasoning: 'AI-powered analysis of your terminal activity'
    };
  }

  // Extract actionable suggestion from AI response
  extractSuggestion(response) {
    const lines = response.split('\n');
    const suggestionLine = lines.find(line => 
      line.toLowerCase().includes('try') || 
      line.toLowerCase().includes('next') ||
      line.toLowerCase().includes('consider') ||
      line.includes('`')
    );
    return suggestionLine?.trim() || 'Continue exploring cybersecurity tools';
  }

  // Enhanced pattern analysis (fallback when no AI)
  getEnhancedPatternAnalysis(command, output, errorOutput, history) {
    const cmd = command.toLowerCase().trim();
    const hasError = errorOutput && errorOutput.length > 0;
    
    // Check for specific tool usage
    if (cmd.includes('nmap')) {
      return this.analyzeNmapUsage(cmd, output, errorOutput, hasError);
    } else if (cmd.includes('john')) {
      return this.analyzeJohnUsage(cmd, output, errorOutput, hasError);
    } else if (cmd.includes('msfconsole') || cmd.includes('meterpreter')) {
      return this.analyzeMetasploitUsage(cmd, output, errorOutput, hasError);
    } else if (cmd.includes('apache') || cmd.includes('service')) {
      return this.analyzeServiceManagement(cmd, output, errorOutput, hasError);
    } else if (hasError) {
      return this.analyzeGeneralError(cmd, output, errorOutput);
    } else {
      return this.provideContextualGuidance(cmd, output, history);
    }
  }

  // Specific tool analysis methods
  analyzeNmapUsage(cmd, output, errorOutput, hasError) {
    if (hasError) {
      if (errorOutput.includes('invalid argument') || errorOutput.includes('quitting')) {
        return {
          type: 'error_fix',
          title: '🎯 Nmap Syntax Error',
          message: 'Nmap flags are case-sensitive and have specific formats.',
          suggestion: 'Try: nmap -sS [target] for SYN scan, or nmap -sV [target] for version detection',
          reasoning: 'Common nmap scans: -sS (stealth), -sV (version), -A (aggressive), -p (ports)'
        };
      }
    } else {
      return {
        type: 'next_step',
        title: '🔍 Network Scanning Progress',
        message: 'Great! You\'re learning network reconnaissance.',
        suggestion: 'Try different scan types: nmap -sV [target] for service versions',
        reasoning: 'Understanding what services are running is crucial for vulnerability assessment'
      };
    }
  }

  analyzeJohnUsage(cmd, output, errorOutput, hasError) {
    return {
      type: 'learning_tip',
      title: '🔐 Password Cracking',
      message: 'John the Ripper is a powerful password auditing tool.',
      suggestion: 'Use wordlists: john --wordlist=/usr/share/wordlists/rockyou.txt [hashfile]',
      reasoning: 'Dictionary attacks are often more effective than brute force'
    };
  }

  analyzeMetasploitUsage(cmd, output, errorOutput, hasError) {
    return {
      type: 'workflow_tip',
      title: '🎯 Metasploit Framework',
      message: 'Following the penetration testing methodology.',
      suggestion: 'Typical workflow: search exploit → use [exploit] → show options → set target → exploit',
      reasoning: 'Systematic exploitation requires understanding the target and setting proper options'
    };
  }

  analyzeServiceManagement(cmd, output, errorOutput, hasError) {
    return {
      type: 'infrastructure',
      title: '🌐 Service Management',
      message: 'Managing services is key to both attack and defense.',
      suggestion: 'Check status: systemctl status [service], logs: journalctl -u [service]',
      reasoning: 'Understanding service states helps identify vulnerabilities and monitor security'
    };
  }

  analyzeGeneralError(cmd, output, errorOutput) {
    return {
      type: 'troubleshooting',
      title: '⚠️ Command Error',
      message: 'Don\'t worry! Errors are part of learning cybersecurity.',
      suggestion: 'Check syntax with: man [command] or [command] --help',
      reasoning: 'Reading documentation builds the troubleshooting skills essential for cybersecurity'
    };
  }

  provideContextualGuidance(cmd, output, history) {
    const task = this.detectCurrentTask(cmd, history);
    const guidance = this.knowledgeBase[Object.keys(this.knowledgeBase).find(tool => 
      cmd.includes(tool)
    )] || {};
    
    return {
      type: 'guidance',
      title: '💡 Keep Exploring',
      message: `You're working on ${task.replace('_', ' ')}. Every command builds expertise.`,
      suggestion: guidance.next_steps?.[0] || 'Continue experimenting with different options',
      reasoning: 'Hands-on practice is the best way to learn cybersecurity tools'
    };
  }

  // Fallback suggestion
  getFallbackSuggestion(command, output, errorOutput) {
    return {
      type: 'general',
      title: '🤖 AI Assistant',
      message: 'I\'m monitoring your terminal activity to help you learn.',
      suggestion: 'Try using --help or man pages to explore command options',
      reasoning: 'Building familiarity with documentation is essential for cybersecurity professionals'
    };
  }
}

module.exports = AITutor;
