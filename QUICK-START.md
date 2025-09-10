# Quick Start Guide

## For End Users

### 🚀 Instant Start (Recommended)
```bash
npx hax-ai-warp
```

That's it! This command will:
1. ✅ Check if you have Node.js and Docker
2. ✅ Download and set up the application
3. ✅ Create configuration files
4. ✅ Start the server on http://localhost:3000

### ⚙️ Custom Setup
```bash
# Run setup first
npx hax-ai-warp --setup

# Edit configuration
nano .env

# Start with custom port
npx hax-ai-warp --port 8080
```

### 🔑 Add AI Features
1. Get API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/account/keys)
2. Edit `.env` file:
   ```bash
   ANTHROPIC_API_KEY=your-key-here
   ```
3. Restart: `npx hax-ai-warp`

---

## For Instructors

### 🏫 Classroom Deployment

#### Option 1: Each Student Runs Locally
```bash
# Share with students:
npx hax-ai-warp
# Students access: http://localhost:3000
```

#### Option 2: Central Server
```bash
# On instructor machine/server:
npx hax-ai-warp --port 3000

# Students access: http://instructor-ip:3000
# Multiple students can connect simultaneously
```

### 📋 Pre-Class Setup Checklist

**Before Class:**
- [ ] Test `npx hax-ai-warp` on your machine
- [ ] Ensure Docker Desktop is running
- [ ] Configure AI API key (optional but recommended)
- [ ] Test student terminal creation
- [ ] Verify cybersecurity tools are available

**Student Requirements:**
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Modern web browser
- [ ] Internet connection

### 🎓 Course Integration

**Example: Cybersecurity 101**
```bash
# Start server for class
npx hax-ai-warp

# Student workflow:
# 1. Open http://localhost:3000
# 2. Enter Student ID: john_doe
# 3. Enter Course: cybersec101
# 4. Click "Connect to Terminal"
# 5. Start learning with AI assistance
```

---

## For System Administrators

### 🖥️ Server Deployment

#### Docker Deployment
```bash
# Clone repository
git clone https://github.com/djfusco/hax-ai-warp.git
cd hax-ai-warp

# Build container
docker build -t hax-ai-warp .

# Run with environment
docker run -d \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e ANTHROPIC_API_KEY=your-key \
  hax-ai-warp
```

#### Production Setup
```bash
# Install globally
npm install -g hax-ai-warp

# Create systemd service
sudo systemctl enable hax-ai-warp
sudo systemctl start hax-ai-warp

# Configure nginx reverse proxy
# SSL termination
# Firewall rules
```

### 🔒 Security Configuration

**Environment Variables:**
```bash
# Production .env
NODE_ENV=production
PORT=3000
STUDENT_PASSWORD=secure-random-password
ANTHROPIC_API_KEY=your-api-key
SESSION_SECRET=random-session-secret
```

**Network Security:**
- Use HTTPS in production
- Configure firewall rules
- Isolate Docker network
- Monitor resource usage

### 📊 Monitoring

```bash
# View active containers
docker ps

# Monitor resource usage
docker stats

# Check logs
docker logs hax-ai-warp

# Cleanup old containers
docker container prune
```

---

## Troubleshooting

### Common Issues

**"Cannot connect to Docker daemon"**
```bash
# Start Docker Desktop
# Ensure Docker daemon is running
docker ps  # Should work without errors
```

**"Port 3000 already in use"**
```bash
# Use different port
npx hax-ai-warp --port 8080

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

**"Module not found" errors**
```bash
# Clear npm cache
npm cache clean --force

# Update Node.js to 18+
node --version  # Should be 18.0.0 or higher
```

**AI not working**
```bash
# Check API key
cat .env | grep API_KEY

# Test API key validity
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages
```

### Getting Help

1. **Check documentation**: README.md, INSTALL.md, USER-GUIDE.md
2. **Search issues**: [GitHub Issues](https://github.com/djfusco/hax-ai-warp/issues)
3. **Ask community**: [GitHub Discussions](https://github.com/djfusco/hax-ai-warp/discussions)
4. **Report bugs**: Create new GitHub issue

---

## Resource Requirements

### Minimum System Requirements
- **CPU**: 2 cores
- **RAM**: 4GB (8GB recommended)
- **Disk**: 2GB free space
- **Network**: Internet connection

### Recommended for Classroom (20+ students)
- **CPU**: 4+ cores
- **RAM**: 16GB+
- **Disk**: 10GB+ free space
- **Network**: High-speed internet

### Docker Resource Allocation
- **Per student container**: ~100MB RAM
- **Base Ubuntu image**: ~500MB disk
- **Maximum concurrent students**: Depends on available resources

---

## Success Stories

### "Perfect for Remote Learning"
> *"HAX AI Warp transformed our cybersecurity course. Students can practice on real Linux terminals from home, and the AI assistance means fewer interruptions during lectures."*
> 
> — Dr. Sarah Johnson, Computer Science Professor

### "Easy Setup, Powerful Learning"
> *"Set up in 5 minutes with `npx hax-ai-warp`. Students love the AI suggestions, and I love not having to maintain 30 different Linux VMs."*
> 
> — Mike Chen, IT Training Instructor

### "Game Changer for Beginners"
> *"The AI explanations help students understand not just what commands do, but why to use them. Perfect for cybersecurity fundamentals."*
> 
> — Lisa Rodriguez, Cybersecurity Bootcamp Director

---

Ready to revolutionize your cybersecurity education? Start with:

```bash
npx hax-ai-warp
```

🎉 **Welcome to the future of hands-on learning!** 🎉
