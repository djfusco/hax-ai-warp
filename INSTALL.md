# Installation Guide

## System Requirements

### Minimum Requirements
- **Operating System**: macOS, Windows, or Linux
- **RAM**: 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Network**: Internet connection for initial setup

### Software Prerequisites

#### 1. Node.js 18+
**Download**: https://nodejs.org/

**Installation verification**:
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show npm version
```

#### 2. Docker Desktop
**Download**: https://docker.com/products/docker-desktop

**Supported platforms**:
- macOS (Intel and Apple Silicon)
- Windows 10/11 with WSL2
- Linux (Ubuntu, Debian, CentOS, Fedora)

**Installation verification**:
```bash
docker --version  # Should show Docker version
docker ps         # Should connect without errors
```

## Installation Methods

### Method 1: NPX (Recommended)

This is the fastest way to get started:

```bash
# Run directly (downloads and runs automatically)
npx hax-ai-warp

# Or run setup first, then start
npx hax-ai-warp --setup
npx hax-ai-warp
```

**Advantages**:
- Always gets the latest version
- No local installation required
- Automatic dependency management
- Easy to update

### Method 2: Global Installation

```bash
# Install globally
npm install -g hax-ai-warp

# Run from anywhere
hax-ai-warp
```

### Method 3: Local Development

```bash
# Clone repository
git clone https://github.com/djfusco/hax-ai-warp.git
cd hax-ai-warp

# Install dependencies
npm install

# Run setup
npm run setup

# Start development server
npm start
```

## First-Time Setup

### 1. Run Setup Wizard

```bash
npx hax-ai-warp --setup
```

This will:
- ✅ Check prerequisites (Node.js, Docker)
- ✅ Download Ubuntu Docker image
- ✅ Create default configuration
- ✅ Test Docker connectivity

### 2. Configure Environment

Edit the `.env` file created in your current directory:

```bash
# Required: Student password for containers
STUDENT_PASSWORD=haxwarp123

# Optional: AI Integration (choose one)
OPENAI_API_KEY=sk-your-openai-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Optional: Server configuration
PORT=3000
```

### 3. Get AI API Key (Recommended)

#### Option A: OpenAI
1. Visit https://platform.openai.com/api-keys
2. Create account and add payment method
3. Generate new API key
4. Add to `.env` as `OPENAI_API_KEY`

#### Option B: Anthropic Claude
1. Visit https://console.anthropic.com/account/keys
2. Create account and add payment method
3. Generate new API key
4. Add to `.env` as `ANTHROPIC_API_KEY`

**Note**: Without an AI API key, the system will use basic pattern matching instead of advanced AI assistance.

## Docker Configuration

### Docker Desktop Settings

**Memory**: Allocate at least 4GB RAM to Docker
- macOS/Windows: Docker Desktop → Settings → Resources → Memory
- Linux: Modify Docker daemon configuration

**Disk Space**: Ensure sufficient space for:
- Ubuntu base image (~500MB)
- Student containers (~100MB each)
- Container logs and data

### Network Configuration

HAX AI Warp uses these ports:
- **3000** (default) - Web interface and API
- **Random high ports** - Docker container SSH access

Firewall configuration:
```bash
# Allow HAX AI Warp (adjust port as needed)
sudo ufw allow 3000/tcp  # Linux
# Windows: Windows Defender Firewall settings
# macOS: System Preferences → Security → Firewall
```

## Verification

### Test Installation

```bash
# Check HAX AI Warp
npx hax-ai-warp --version

# Test Docker
docker run --rm hello-world

# Test Node.js
node -e "console.log('Node.js is working')"
```

### Test Full System

1. Start HAX AI Warp:
   ```bash
   npx hax-ai-warp
   ```

2. Open browser to `http://localhost:3000`

3. Create test session:
   - Student ID: `test`
   - Course: `demo`

4. Verify container creation and terminal access

5. Test AI features (if configured):
   - Type invalid command: `lss`
   - Check for AI suggestion

## Troubleshooting

### Docker Issues

**"Cannot connect to Docker daemon"**
```bash
# Start Docker Desktop
# Wait for it to fully initialize
# Try again
```

**"docker: command not found"**
- Install Docker Desktop
- Restart terminal
- Ensure Docker is in PATH

### Permission Issues

**macOS/Linux permission errors**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
# Log out and back in

# macOS: Ensure Docker Desktop has full disk access
# System Preferences → Security → Full Disk Access
```

### Network Issues

**Port already in use**
```bash
# Use different port
npx hax-ai-warp --port 8080

# Or find what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Node.js Issues

**"command not found: npx"**
- Update Node.js to 18+
- Reinstall npm: `npm install -g npm@latest`

**Module resolution errors**
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Platform-Specific Notes

### macOS
- Requires macOS 10.15+ for Docker Desktop
- Apple Silicon (M1/M2) fully supported
- Rosetta 2 not required

### Windows
- Requires Windows 10/11 with WSL2
- Enable Hyper-V and Containers features
- Docker Desktop must use WSL2 backend

### Linux
- Install Docker Engine or Docker Desktop
- Ensure user is in docker group
- SystemD or equivalent required for containers

## Performance Optimization

### Docker Optimization
```bash
# Clean up unused containers
docker container prune

# Clean up unused images
docker image prune

# Monitor resource usage
docker stats
```

### System Optimization
- Close unnecessary applications
- Ensure sufficient RAM available
- Use SSD storage for better performance
- Monitor CPU usage during heavy use

## Security Considerations

### Network Security
- Run on isolated network for classroom use
- Use HTTPS in production (add reverse proxy)
- Configure firewall rules appropriately

### Container Security
- Student containers are isolated by default
- No host filesystem access
- Limited network access
- Automatic cleanup after sessions

### API Key Security
- Store API keys securely in `.env`
- Never commit `.env` to version control
- Rotate keys regularly
- Monitor API usage for unexpected charges
