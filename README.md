# HAX AI Warp - Cybersecurity Lab Environment

Browser-accessible Linux sandbox containers with **AI-powered terminal assistance** for educational use. Provides isolated cybersecurity lab environments using Docker containers with pre-installed security tools and intelligent tutoring.

## Features

- 🔐 **Cybersecurity Lab Environment**: Pre-configured Ubuntu containers with security tools
- 🤖 **AI-Powered Terminal Assistant**: Warp.dev-like AI monitoring and suggestions
- 🚀 **Instant Access**: Browser-based terminal interface with real-time connectivity
- 👥 **Student Isolation**: Each student gets their own containerized environment
- 🛠️ **Security Tools**: nmap, metasploit, wireshark, john, hydra, and more
- 🎓 **Educational Focus**: Context-aware learning assistance and error guidance
- 🐳 **Container Management**: Automatic container creation and lifecycle managementp - Cybersecurity Lab Environment

Browser-accessible Linux sandbox containers with terminal integration for educational use. Provides isolated cybersecurity lab environments using Docker containers with pre-installed security tools.

## Features

- 🔐 **Cybersecurity Lab Environment**: Pre-configured Ubuntu containers with security tools
- 🚀 **Instant Access**: Browser-based terminal interface with real-time connectivity
- 👥 **Student Isolation**: Each student gets their own containerized environment
- 🛠️ **Security Tools**: nmap, metasploit, wireshark, john, hydra, and more
- 🎓 **Educational Focus**: Designed for cybersecurity courses and training
- � **Container Management**: Automatic container creation and lifecycle management

## Quick Start

### Prerequisites

1. **Docker Desktop**: [Download and install Docker](https://www.docker.com/products/docker-desktop/)
2. **Node.js**: [Download Node.js](https://nodejs.org/) (version 18+ recommended)

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd hax-ai-warp
   npm install
   npm run setup
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Access the interface**:
   - Open http://localhost:3000 in your browser
   - Enter student ID and course name
   - Wait for container to be ready (first time may take 1-2 minutes)

## AI Assistant Configuration

### Pattern-Matching Mode (Default)
Works immediately without API keys - provides basic cybersecurity guidance and error detection.

### Full AI Mode (Warp.dev-like)
For advanced AI features, set up an API key:

1. **Get an API key**:
   - **OpenAI**: [Get API key](https://platform.openai.com/api-keys) (recommended)
   - **Anthropic**: [Get API key](https://console.anthropic.com/) (alternative)

2. **Configure environment**:
   ```bash
   # Copy example file
   cp .env.example .env
   
   # Edit .env file and add your API key:
   OPENAI_API_KEY=your-actual-api-key-here
   # OR
   ANTHROPIC_API_KEY=your-actual-api-key-here
   ```

3. **Test AI functionality**:
   ```bash
   node test-ai.js
   ```

4. **Restart server** to activate full AI features

### AI Features
- **Real-time monitoring**: Watches all terminal activity
- **Error detection**: Identifies and explains command failures
- **Educational guidance**: Provides context-aware learning suggestions
- **Next-step recommendations**: Suggests logical follow-up commands
- **Tool-specific help**: Specialized knowledge for cybersecurity tools

## Container Architecture

### Cybersecurity Lab Image
The system builds a custom Docker image (`hax-ai-cyber-lab`) with:

- **Base**: Ubuntu 22.04 LTS
- **Tools**: nmap, netcat, tcpdump, wireshark, john, hydra, python3
- **User**: `student` with sudo access (password: `haxwarp123`)
- **SSH**: Enabled for terminal connections

### Container Lifecycle
- **Creation**: Automatic per student/course combination
- **Naming**: `hax-{course}-{studentid}` (sanitized)
- **Persistence**: Containers persist until manually removed
- **Isolation**: Full network and filesystem isolation

## Usage

### For Students
1. Enter your student ID and course name
2. Wait for "Container ready" message
3. Use password `haxwarp123` when prompted
4. Access cybersecurity tools in your isolated environment

### For Instructors
- Access instructor panel: `http://localhost:3000?instructor=true`
- View active containers and terminals
- Monitor student sessions

### Available Commands in Container
```bash
# Network scanning
nmap -sV target.com

# Password cracking
john hashfile.txt

# Network capture
tcpdump -i eth0

# Web security testing
python3 -m http.server 8080
```

## API Endpoints

- `POST /api/sessions` - Create student session
- `GET /api/containers` - List Docker containers
- `GET /api/terminals` - List active terminals
- `GET /api/health` - Health check

## Configuration

### Environment Variables
```bash
PORT=3000                    # Server port
DOCKER_MEMORY_LIMIT=512m     # Container memory limit
DOCKER_CPU_LIMIT=0.5         # Container CPU limit
```

### Docker Settings
- **Memory**: 512MB per container (configurable)
- **CPU**: 0.5 cores per container (configurable)
- **Network**: Bridge mode with SSH port mapping
- **Capabilities**: NET_ADMIN and SYS_ADMIN for security tools

## Development

### Project Structure
```
hax-ai-warp/
├── server.js                 # Main Express server
├── lib/
│   ├── docker-container-manager.js  # Docker operations
│   ├── terminal-manager.js          # Terminal connections
│   └── auth-manager.js              # Session management
├── public/                   # Frontend assets
├── scripts/
│   └── setup.js             # Installation script
└── test-docker.js           # Integration tests
```

### Scripts
```bash
npm start              # Start production server
npm run dev            # Start with nodemon (development)
npm run setup          # Setup Docker environment
node test-docker.js    # Test Docker integration
```

### Docker Commands
```bash
# List containers
docker ps -a

# View container logs
docker logs hax-cyber362-student1

# Execute command in container
docker exec hax-cyber362-student1 whoami

# Remove container
docker stop hax-cyber362-student1
docker rm hax-cyber362-student1
```

## Troubleshooting

### Docker Issues
- **"Docker not found"**: Install Docker Desktop and ensure it's running
- **"Permission denied"**: Add user to docker group or run with sudo
- **"Container won't start"**: Check Docker Desktop memory/CPU limits

### Connection Issues
- **"Connecting..." stuck**: Container may still be starting (wait 1-2 minutes)
- **SSH timeout**: Check if container SSH service is running
- **Port conflicts**: Ensure no other services on port 3000

### Performance Issues
- **Slow container startup**: First-time Docker image build takes time
- **High memory usage**: Adjust DOCKER_MEMORY_LIMIT in environment
- **Too many containers**: Clean up old containers with `docker container prune`

## Security Considerations

- Containers run with limited capabilities
- Student user has sudo access (required for security tools)
- SSH keys are auto-generated and temporary
- Containers are isolated from host filesystem
- Default password should be changed in production

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create feature branch
3. Test with `node test-docker.js`
4. Submit pull request

For issues or questions, please create a GitHub issue.
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built for educators who want to give students real Linux experience without the complexity of individual VM setup.**
