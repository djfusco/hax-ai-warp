const pty = require('node-pty');

class TerminalManager {
  constructor(vmManager) {
    this.terminals = new Map();
    this.sockets = new Map();
    this.vmManager = vmManager;
    this.io = null; // Will be set by server
  }

  setSocketIO(io) {
    this.io = io;
  }

  async createTerminal(studentId, vmId) {
    const { v4: uuidv4 } = await import('uuid');
    const terminalId = uuidv4();
    
    // Try to connect to VM first, fallback to local if VM fails
    let terminal;
    try {
      console.log(`Attempting to connect to VM: ${vmId}`);
      
      // First ensure VM exists and is ready
      if (this.vmManager) {
        await this.vmManager.getOrCreateStudentVM(studentId, vmId.split('-')[0]);
        await this.ensureVMReady(vmId);
      }
      
      // Connect to VM via multipass
      terminal = pty.spawn('multipass', [
        'exec', vmId, '--', 'bash', '-l'
      ], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
      });
      
      console.log(`Successfully connected to VM: ${vmId}`);
      
    } catch (error) {
      console.warn(`VM connection failed for ${vmId}, using local terminal:`, error.message);
      
      // Fallback to local terminal with clear indication
      terminal = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
      });
      
      // Send explanatory message
      setTimeout(() => {
        terminal.write(`\r\n� VM Connection Failed - Using Local Terminal\r\n`);
        terminal.write(`VM: ${vmId} is not ready. Using local environment for now.\r\n`);
        terminal.write(`Contact instructor if this persists.\r\n\r\n`);
      }, 100);
    }

    this.terminals.set(terminalId, {
      id: terminalId,
      studentId,
      vmId,
      terminal,
      createdAt: new Date()
    });

    // Handle terminal output
    terminal.on('data', (data) => {
      this.broadcastToTerminal(terminalId, 'output', data);
    });

    terminal.on('exit', () => {
      this.terminals.delete(terminalId);
      this.broadcastToTerminal(terminalId, 'exit');
    });

    return { id: terminalId };
  }

  async ensureVMReady(vmId, maxAttempts = 5) {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await execAsync(`multipass exec ${vmId} -- echo "ready"`, { timeout: 5000 });
        return true;
      } catch (error) {
        console.log(`Quick VM check ${vmId} (${i + 1}/${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error(`VM ${vmId} is not responding to quick check`);
  }

  sendInput(terminalId, input) {
    const terminalSession = this.terminals.get(terminalId);
    if (terminalSession) {
      terminalSession.terminal.write(input);
    }
  }

  broadcastToTerminal(terminalId, event, data) {
    if (this.io) {
      this.io.to(`terminal-${terminalId}`).emit('terminal-output', { output: data });
    }
  }

  async getVMIP(vmId) {
    if (this.vmManager) {
      return await this.vmManager.getVMIP(vmId);
    }
    // Fallback to hardcoded IP
    return '192.168.64.2';
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
      vmId: session.vmId,
      createdAt: session.createdAt
    }));
  }
}

module.exports = TerminalManager;
