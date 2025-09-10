# HAX AI Warp 🚀

> AI-powered cybersecurity education platform with Docker-based Linux terminals and intelligent tutoring

HAX AI Warp provides students and educators with an interactive, browser-based Linux terminal environment enhanced with AI-powered assistance. Perfect for cybersecurity courses, Linux training, and hands-on learning.

## ✨ Features

- 🖥️ **Browser-based Linux terminals** - No local Linux setup required
- 🤖 **AI-powered tutoring** - Intelligent suggestions and error help (OpenAI/Claude)
- 🐳 **Docker-based isolation** - Safe, sandboxed learning environments
- 🎓 **Educational focus** - Designed for cybersecurity and Linux courses
- 🔒 **Secure by default** - Isolated containers with controlled access
- 📱 **Multi-user support** - Multiple students can use simultaneously
- ⚡ **Real-time assistance** - Get help as you type commands

## 🎯 Perfect For

- **Cybersecurity courses** - Practice with security tools in safe environments
- **Linux training** - Learn command line skills with AI guidance
- **Remote learning** - Consistent environment accessible from anywhere
- **Computer labs** - Easy deployment for educational institutions
- **Self-study** - Personal learning with intelligent assistance

## 📋 Prerequisites

Before installing, ensure you have:

### Required
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Docker Desktop** - [Download from docker.com](https://docker.com/products/docker-desktop)

### Recommended
- **AI API Key** (for full AI features):
  - [OpenAI API Key](https://platform.openai.com/api-keys) OR
  - [Anthropic Claude API Key](https://console.anthropic.com/account/keys)

## 🚀 Quick Start

### Option 1: NPX (Recommended)
```bash
# Install and run in one command
npx hax-ai-warp

# Or run setup first
npx hax-ai-warp --setup
```

### Option 2: Manual Installation
```bash
# Clone the repository
git clone https://github.com/djfusco/hax-ai-warp.git
cd hax-ai-warp

# Install dependencies
npm install

# Run setup
npm run setup

# Start the server
npm start
```

## ⚙️ Configuration

### 1. Environment Setup

The system will create a `.env` file automatically. Edit it to configure:

```bash
# Student password for Docker containers
STUDENT_PASSWORD=haxwarp123

# AI Configuration (choose one)
OPENAI_API_KEY=your-openai-api-key-here
# OR
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration
PORT=3000
```

### 2. Get Your AI API Key

**Option A: OpenAI (GPT)**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account and add billing information
3. Generate a new API key
4. Add it to your `.env` file as `OPENAI_API_KEY`

**Option B: Anthropic Claude (Recommended)**
1. Go to [Anthropic Console](https://console.anthropic.com/account/keys)
2. Create an account and add billing information
3. Generate a new API key
4. Add it to your `.env` file as `ANTHROPIC_API_KEY`

### 3. Start the Server

```bash
# Using NPX
npx hax-ai-warp

# Or if installed locally
npm start

# Custom port
npx hax-ai-warp --port 8080
```

## 🌐 Usage

1. **Open your browser** to `http://localhost:3000`
2. **Enter student information** - Student ID and course name
3. **Start your terminal session** - A Docker container will be created
4. **Begin learning!** - The AI will provide suggestions as you work

### Example Session

```bash
# In the web terminal:
student@container:~$ ls
README.txt

student@container:~$ lss
-bash: lss: command not found

# AI suggests: "Did you mean 'ls'? This command lists directory contents."

student@container:~$ nmap --help
# AI explains: "nmap is a network scanning tool. Use 'nmap -sn 192.168.1.0/24' to scan for hosts."
```

## 🎓 Educational Use

### For Instructors

1. **Deploy once** - Students access via web browser
2. **Consistent environment** - Everyone uses the same Linux setup
3. **Safe experimentation** - Docker containers are isolated
4. **Monitor progress** - See student activity in real-time
5. **AI assistance** - Students get help without interrupting class

### For Students

1. **No setup required** - Just open a web browser
2. **AI guidance** - Get help with commands and concepts
3. **Safe learning** - Experiment without breaking anything
4. **Accessible anywhere** - Learn from any device with a browser
5. **Real Linux environment** - Practice with actual tools

## 🔧 Command Line Options

```bash
npx hax-ai-warp [options]

Options:
  --port <port>     Server port (default: 3000)
  --help, -h        Show help message
  --version, -v     Show version
  --setup           Run setup wizard

Examples:
  npx hax-ai-warp                 # Start on port 3000
  npx hax-ai-warp --port 8080     # Start on port 8080
  npx hax-ai-warp --setup         # Run setup wizard
```

## 🐳 Docker Requirements

The system automatically manages Docker containers but requires:

- **Docker Desktop** running
- **Internet connection** for downloading Ubuntu images
- **Sufficient disk space** (~500MB for base Ubuntu image)

Each student session creates an isolated Ubuntu 22.04 container with:
- Common cybersecurity tools
- Development utilities
- Network analysis tools
- Text editors and compilers

## 🔒 Security Features

- **Isolated containers** - Each student gets their own environment
- **No host access** - Containers cannot access the host system
- **Automatic cleanup** - Containers are removed after sessions
- **Configurable passwords** - Set secure access credentials
- **API key security** - Keys stored locally, never transmitted

## 🚨 Troubleshooting

### Docker Issues
```bash
# Check Docker is running
docker ps

# If not running, start Docker Desktop
# Then restart HAX AI Warp
```

### Port Already in Use
```bash
# Use a different port
npx hax-ai-warp --port 8080
```

### AI Not Working
1. Check your API key in `.env` file
2. Verify you have billing set up with AI provider
3. Check API key permissions
4. Look for error messages in terminal

### Performance Issues
- Ensure Docker has enough memory allocated (4GB+ recommended)
- Close unused containers: `docker container prune`
- Monitor disk space: `docker system df`

## 📈 Monitoring

View real-time information:
- **Active sessions**: Server shows connected students
- **Container status**: Docker containers are managed automatically
- **AI usage**: Monitor API calls and responses
- **Resource usage**: Check Docker Desktop for container resources

## 🛡️ Privacy & Data

- **No data collection** - All processing happens locally
- **API keys stay local** - Never transmitted to our servers
- **Student privacy** - No personal data stored or transmitted
- **Session isolation** - Student work is contained within their session

## 📚 Examples

### Cybersecurity Course Setup

```bash
# Start server for class
npx hax-ai-warp --port 3000

# Students access: http://your-server:3000
# Each student creates their own isolated environment
# AI helps with nmap, netcat, wireshark, etc.
```

### Linux Training

```bash
# Focus on command line skills
# AI provides explanations for:
# - File system navigation
# - Permission management
# - Process control
# - Network configuration
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/djfusco/hax-ai-warp/issues)
- **Documentation**: [Full documentation](https://github.com/djfusco/hax-ai-warp/wiki)
- **Community**: [Discussions](https://github.com/djfusco/hax-ai-warp/discussions)

## 🎉 Acknowledgments

Built with:
- [xterm.js](https://xtermjs.org/) - Terminal emulation
- [Socket.IO](https://socket.io/) - Real-time communication
- [Docker](https://docker.com/) - Container management
- [Express.js](https://expressjs.com/) - Web server
- [OpenAI](https://openai.com/) / [Anthropic](https://anthropic.com/) - AI assistance

---

**Made with ❤️ for education**

Transform your cybersecurity and Linux education with AI-powered assistance!
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
The system uses a pre-built Docker image (`dfusco/hax-ai-cyber-lab`) with:

- **Base**: Ubuntu 22.04 LTS
- **Tools**: nmap, netcat, tcpdump, wireshark, john, hydra, python3
- **User**: `student` with sudo access (password: set in `.env` file)
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
3. Use the password from your `.env` file when prompted
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
# Server Configuration
PORT=3000                    # Server port
DOCKER_MEMORY_LIMIT=512m     # Container memory limit
DOCKER_CPU_LIMIT=0.5         # Container CPU limit

# Security Configuration
STUDENT_PASSWORD=your_secure_password_here  # Student container password

# AI Configuration (Optional)
OPENAI_API_KEY=your_openai_key      # For AI assistance
ANTHROPIC_API_KEY=your_anthropic_key # Alternative AI provider
```

### Security Notes

🔒 **Important**: The `.env` file contains sensitive configuration and should never be committed to version control. 

- **Student Password**: Set `STUDENT_PASSWORD` in your `.env` file instead of using hardcoded passwords
- **API Keys**: Keep your AI provider API keys secure in the `.env` file
- **Environment Isolation**: Each student gets an isolated container with the configured password
- **Default Fallback**: If no password is set, defaults to `defaultpass123`

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
