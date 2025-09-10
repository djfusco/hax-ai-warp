const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

class DockerContainerManager {
  constructor() {
    this.containersDir = path.join(process.env.HOME, '.hax-ai-warp', 'containers');
    this.ensureContainersDirectory();
    this.imageName = 'dfusco/hax-ai-cyber-lab:latest';
  }

  async ensureContainersDirectory() {
    try {
      await fs.mkdir(this.containersDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create containers directory:', error);
    }
  }

  async listContainers() {
    try {
      const { stdout } = await execAsync('docker ps -a --format "{{json .}}"');
      const lines = stdout.trim().split('\n').filter(line => line);
      return lines.map(line => JSON.parse(line));
    } catch (error) {
      console.error('Failed to list containers:', error);
      return [];
    }
  }

  async createContainer(name, options = {}) {
    const {
      memory = '512m',
      cpus = '0.5'
    } = options;

    console.log(`Creating container: ${name}`);
    
    try {
      // Create container with cybersecurity tools
      const command = `docker run -d --name ${name} --memory=${memory} --cpus=${cpus} --cap-add=NET_ADMIN --cap-add=SYS_ADMIN -p 0:22 ${this.imageName}`;
        
      const { stdout } = await execAsync(command);
      const containerId = stdout.trim();
      
      // Get the assigned SSH port
      const portInfo = await this.getContainerPort(name);
      
      return { 
        name, 
        id: containerId, 
        status: 'created', 
        sshPort: portInfo.sshPort,
        ip: portInfo.ip
      };
    } catch (error) {
      console.error(`Failed to create container ${name}:`, error);
      throw error;
    }
  }

  async getContainerPort(containerName) {
    try {
      const { stdout } = await execAsync(`docker port ${containerName} 22`);
      const sshPort = stdout.trim().split(':')[1];
      
      // Get container IP
      const { stdout: ipInfo } = await execAsync(`docker inspect ${containerName} --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'`);
      const ip = ipInfo.trim();
      
      return { sshPort: parseInt(sshPort), ip };
    } catch (error) {
      console.error(`Failed to get port for container ${containerName}:`, error);
      return { sshPort: null, ip: null };
    }
  }

  async getOrCreateStudentContainer(studentId, courseName) {
    const containerName = `hax-${courseName}-${studentId}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    
    // Check if container already exists
    const containers = await this.listContainers();
    const existingContainer = containers.find(container => container.Names.includes(containerName));
    
    if (existingContainer) {
      if (existingContainer.State === 'running') {
        console.log(`Using existing running container: ${containerName}`);
        const portInfo = await this.getContainerPort(containerName);
        return { name: containerName, ...portInfo };
      } else {
        console.log(`Starting stopped container: ${containerName}`);
        await execAsync(`docker start ${containerName}`);
        await this.waitForContainerReady(containerName);
        const portInfo = await this.getContainerPort(containerName);
        return { name: containerName, ...portInfo };
      }
    }
    
    // Create new container for student
    console.log(`Creating new container for student: ${containerName}`);
    const result = await this.createContainer(containerName);
    await this.waitForContainerReady(containerName);
    return result;
  }

  async waitForContainerReady(containerName, maxAttempts = 30) {
    console.log(`Waiting for container ${containerName} to be ready...`);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        // Test if container is ready by checking if SSH is listening
        await execAsync(`docker exec ${containerName} pgrep sshd`);
        console.log(`Container ${containerName} is ready!`);
        return true;
      } catch (error) {
        console.log(`Container ${containerName} not ready yet... (${i + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error(`Container ${containerName} failed to become ready after ${maxAttempts * 2} seconds`);
  }

  async execInContainer(containerName, command) {
    try {
      const { stdout } = await execAsync(`docker exec ${containerName} ${command}`);
      return stdout;
    } catch (error) {
      console.error(`Failed to execute command in container ${containerName}:`, error);
      throw error;
    }
  }

  async deleteContainer(containerName) {
    try {
      await execAsync(`docker stop ${containerName}`);
      await execAsync(`docker rm ${containerName}`);
      console.log(`Container deleted: ${containerName}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete container ${containerName}:`, error);
      return false;
    }
  }

  async resetContainer(containerName) {
    console.log(`Resetting container: ${containerName}`);
    await this.deleteContainer(containerName);
    // Container will be recreated on next request
    return true;
  }

  async buildCyberLabImage() {
    console.log('Building cybersecurity lab Docker image...');
    
    const dockerfile = `FROM ubuntu:22.04

# Set non-interactive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

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
    hydra \\
    python3 \\
    python3-pip \\
    git \\
    unzip \\
    && rm -rf /var/lib/apt/lists/*

# Create student user with sudo privileges
ARG STUDENT_PASSWORD=defaultpass123
RUN useradd -m -s /bin/bash student && \\
    echo "student:\${STUDENT_PASSWORD}" | chpasswd && \\
    usermod -aG sudo student

# Set up SSH
RUN mkdir /var/run/sshd && \\
    echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config && \\
    echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config && \\
    sed 's@session\\s*required\\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

# Create welcome files for students
RUN echo "Welcome to HAX AI Cybersecurity Lab!" > /home/student/README.txt && \\
    echo "Available tools: nmap, netcat, tcpdump, wireshark, john, hydra" >> /home/student/README.txt && \\
    echo "Default password: \${STUDENT_PASSWORD}" >> /home/student/README.txt && \\
    chown student:student /home/student/README.txt

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
`;

    try {
      require('fs').writeFileSync('/tmp/hax-ai-dockerfile', dockerfile);
      const studentPassword = process.env.STUDENT_PASSWORD || 'defaultpass123';
      await execAsync(`docker build --build-arg STUDENT_PASSWORD=${studentPassword} -t dfusco/hax-ai-cyber-lab:latest /tmp -f /tmp/hax-ai-dockerfile`);
      console.log('✅ Cybersecurity lab image built successfully!');
      return true;
    } catch (error) {
      console.error('Failed to build image:', error);
      throw error;
    }
  }
}

module.exports = DockerContainerManager;
