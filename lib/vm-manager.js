const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

class VMManager {
  constructor() {
    this.vmsDir = path.join(process.env.HOME, '.hax-ai-warp', 'vms');
    this.ensureVMsDirectory();
  }

  async ensureVMsDirectory() {
    try {
      await fs.mkdir(this.vmsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create VMs directory:', error);
    }
  }

  async listVMs() {
    try {
      const { stdout } = await execAsync('multipass list --format json');
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Failed to list VMs:', error);
      return { list: [] };
    }
  }

  async createVM(name, options = {}) {
    const {
      cpus = 2,
      memory = '4G', 
      disk = '20G',
      release = 'jammy'
    } = options;

    console.log(`Creating VM: ${name} (this will take 2-3 minutes)...`);
    
    try {
      // Create the VM with basic settings
      const command = `multipass launch --name ${name} --cpus ${cpus} --memory ${memory} --disk ${disk} ${release}`;
      console.log(`Running: ${command}`);
      await execAsync(command, { timeout: 300000 }); // 5 minute timeout for VM creation
      
      // Wait for VM to be fully ready
      console.log(`VM ${name} created, waiting for it to be ready...`);
      await this.waitForVMReady(name);
      
      // Do minimal setup for now - just ensure SSH is working
      console.log(`VM ${name} is ready! Doing basic setup...`);
      await this.basicSetup(name);
      
      return { name, status: 'created', ip: await this.getVMIP(name) };
    } catch (error) {
      console.error(`Failed to create VM ${name}:`, error);
      throw error;
    }
  }

  async waitForVMReady(vmName, maxAttempts = 40) {
    console.log(`Waiting for VM ${vmName} to become ready (this may take 2-3 minutes for new VMs)...`);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        // Test if VM is ready by running a simple command
        await execAsync(`multipass exec ${vmName} -- echo "ready"`, { timeout: 10000 });
        console.log(`VM ${vmName} is ready!`);
        return true;
      } catch (error) {
        const timeElapsed = (i + 1) * 3;
        console.log(`VM ${vmName} not ready yet... ${timeElapsed}s elapsed (max ${maxAttempts * 3}s)`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      }
    }
    throw new Error(`VM ${vmName} failed to become ready after ${maxAttempts * 3} seconds`);
  }

  async basicSetup(vmName) {
    console.log(`Basic setup for VM: ${vmName}`);
    
    try {
      // Just ensure basic tools are available - keep it minimal for speed
      await execAsync(`multipass exec ${vmName} -- sudo apt update`, { timeout: 60000 });
      console.log(`Basic setup complete for VM: ${vmName}`);
    } catch (error) {
      console.warn(`Basic setup failed for ${vmName}, but VM should still work:`, error.message);
    }
  }

  async setupVM(vmName) {
    console.log(`Setting up VM: ${vmName}`);
    
    const setupCommands = [
      'sudo apt update && sudo apt upgrade -y',
      'sudo apt install -y curl wget vim nano ssh openssh-server build-essential',
      'sudo systemctl enable --now ssh',
      // Install ttyd for web terminal
      'sudo apt install -y cmake libjson-c-dev libwebsockets-dev libuv1-dev',
      // Create a setup script for ttyd
      'curl -L https://github.com/tsl0922/ttyd/releases/latest/download/ttyd.x86_64 -o ttyd',
      'chmod +x ttyd && sudo mv ttyd /usr/local/bin/',
      // Install Warp (if available for Linux)
      'curl -fsSL https://releases.warp.dev/stable/v*/warp-terminal-deb.sh | sudo bash || echo "Warp not available"'
    ];

    for (const command of setupCommands) {
      try {
        await execAsync(`multipass exec ${vmName} -- bash -c "${command}"`);
      } catch (error) {
        console.warn(`Setup command failed: ${command}`, error.message);
      }
    }
  }

  async getVMIP(vmName) {
    try {
      const { stdout } = await execAsync(`multipass info ${vmName} --format json`);
      const info = JSON.parse(stdout);
      return info.info[vmName].ipv4[0];
    } catch (error) {
      console.error(`Failed to get IP for VM ${vmName}:`, error);
      return null;
    }
  }

  async getOrCreateStudentVM(studentId, courseName) {
    const vmName = `${courseName}-${studentId}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    
    // For now, just return the VM name without creating it
    // This allows the system to work immediately while VMs can be created manually later
    console.log(`Student VM name would be: ${vmName} (not creating automatically)`);
    return vmName;
  }

  async startTTYD(vmName, port = 8080) {
    try {
      const command = `nohup /usr/local/bin/ttyd -p ${port} -i 0.0.0.0 bash > /tmp/ttyd.log 2>&1 &`;
      await execAsync(`multipass exec ${vmName} -- bash -c "${command}"`);
      console.log(`TTYD started on VM ${vmName} port ${port}`);
      return true;
    } catch (error) {
      console.error(`Failed to start TTYD on ${vmName}:`, error);
      return false;
    }
  }

  async deleteVM(vmName) {
    try {
      await execAsync(`multipass delete ${vmName} --purge`);
      console.log(`VM deleted: ${vmName}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete VM ${vmName}:`, error);
      return false;
    }
  }

  async resetVM(vmName) {
    console.log(`Resetting VM: ${vmName}`);
    await this.deleteVM(vmName);
    // VM will be recreated on next request
    return true;
  }
}

module.exports = VMManager;
