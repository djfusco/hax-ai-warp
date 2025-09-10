#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class SetupScript {
  constructor() {
    this.configDir = path.join(process.env.HOME, '.hax-ai-warp');
    this.run();
  }

  async run() {
    console.log('🚀 Setting up HAX AI Warp...\n');

    try {
      await this.checkPrerequisites();
      await this.createDirectories();
      await this.createConfig();
      await this.checkDocker();
      await this.setupDockerImage();
      console.log('\n✅ Setup complete! Run "npm start" to launch the server.');
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log('📋 Checking prerequisites...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`   Node.js: ${nodeVersion}`);
    
    if (parseInt(nodeVersion.slice(1)) < 16) {
      throw new Error('Node.js 16 or higher required');
    }

    // Check if running on macOS
    if (process.platform !== 'darwin') {
      console.log('   ⚠️  This setup is optimized for macOS. Some features may not work on other platforms.');
    }

    console.log('   ✅ Prerequisites OK');
  }

  async createDirectories() {
    console.log('📁 Creating directories...');
    
    const dirs = [
      this.configDir,
      path.join(this.configDir, 'vms'),
      path.join(this.configDir, 'logs'),
      path.join(this.configDir, 'sessions')
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
      console.log(`   Created: ${dir}`);
    }
  }

  async createConfig() {
    console.log('⚙️  Creating configuration...');
    
    const envContent = `# HAX AI Warp Configuration
PORT=3000
JWT_SECRET=hax-ai-warp-${Math.random().toString(36).substring(7)}
VM_PREFIX=hax-ai-warp
DEFAULT_VM_MEMORY=4G
DEFAULT_VM_CPUS=2
DEFAULT_VM_DISK=20G
SESSION_TIMEOUT=8h
`;

    const envPath = path.join(this.configDir, '.env');
    await fs.writeFile(envPath, envContent);
    console.log(`   Created: ${envPath}`);

    // Create symlink in project directory
    const projectEnvPath = path.join(__dirname, '..', '.env');
    try {
      await fs.unlink(projectEnvPath);
    } catch (e) {
      // File doesn't exist, that's fine
    }
    
    await fs.symlink(envPath, projectEnvPath);
    console.log(`   Linked: ${projectEnvPath}`);
  }

  async checkDocker() {
    console.log('� Checking Docker...');
    
    return new Promise((resolve, reject) => {
      exec('docker --version', (error, stdout, stderr) => {
        if (error) {
          console.log('   ❌ Docker not found');
          console.log('   💡 Install Docker Desktop from: https://www.docker.com/products/docker-desktop/');
          console.log('   💡 Or install via Homebrew: brew install --cask docker');
          reject(new Error('Docker is required but not installed'));
        } else {
          console.log(`   ✅ Docker found: ${stdout.trim()}`);
          resolve();
        }
      });
    });
  }

  async setupDockerImage() {
    console.log('🛠️  Setting up cybersecurity lab image...');
    
    return new Promise((resolve, reject) => {
      // Create Dockerfile for cybersecurity lab environment
      const dockerfile = `FROM ubuntu:22.04

# Install essential tools for cybersecurity education
RUN apt-get update && apt-get install -y \\
    openssh-server \\
    sudo \\
    curl \\
    wget \\
    vim \\
    nano \\
    net-tools \\
    iputils-ping \\
    nmap \\
    netcat \\
    tcpdump \\
    wireshark-common \\
    john \\
    hashcat \\
    hydra \\
    sqlmap \\
    nikto \\
    dirb \\
    gobuster \\
    metasploit-framework \\
    python3 \\
    python3-pip \\
    git \\
    && rm -rf /var/lib/apt/lists/*

# Create student user
RUN useradd -m -s /bin/bash student && \\
    echo 'student:password' | chpasswd && \\
    usermod -aG sudo student

# Set up SSH
RUN mkdir /var/run/sshd && \\
    echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config && \\
    sed 's@session\\s*required\\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
`;

      require('fs').writeFileSync('/tmp/hax-ai-dockerfile', dockerfile);
      
      console.log('   Building cybersecurity lab image (this may take a few minutes)...');
      exec('docker build -t hax-ai-cyber-lab /tmp -f /tmp/hax-ai-dockerfile', (error, stdout, stderr) => {
        if (error) {
          console.log('   ⚠️  Docker build failed, but you can build it later');
          console.log('   💡 Run: docker build -t hax-ai-cyber-lab . -f /tmp/hax-ai-dockerfile');
          resolve(); // Don't fail setup for this
        } else {
          console.log('   ✅ Cybersecurity lab image ready!');
          resolve();
        }
      });
    });
  }
}

new SetupScript();
