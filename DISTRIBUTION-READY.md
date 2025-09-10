# HAX AI Warp - Installation Guide

Follow these steps to install and run HAX AI Warp with the pre-built Docker image.

## Prerequisites

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Docker Desktop** - [Download from docker.com](https://docker.com/products/docker-desktop)
- **Docker Hub account** - [Create free account at hub.docker.com](https://hub.docker.com)
- **API Key** from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/account/keys)

## Required Pre-Installation Steps

**IMPORTANT**: Run these commands first, before installing HAX AI Warp:

### Step 1: Login to Docker Hub
```bash
docker login
```
Enter your Docker Hub username and password when prompted.

### Step 2: Pull the HAX AI Warp Docker Image
```bash
docker pull dfusco/hax-ai-cyber-lab:latest
```
This will download the cybersecurity lab environment (~1.4GB). Wait for it to complete.

### Step 3: Verify the Image is Available
```bash
docker images | grep dfusco/hax-ai-cyber-lab
```
You should see: `dfusco/hax-ai-cyber-lab   latest   ...`

## Installation

After completing the pre-installation steps above:

### Option 1: NPX (Recommended)
```bash
npx hax-ai-warp
```

### Option 2: Manual Installation
```bash
# Clone or download the repository
git clone https://github.com/djfusco/hax-ai-warp.git
cd hax-ai-warp

# Install dependencies
npm install

# Start the application
npm start
```

## Setup

1. **The application will start** and automatically detect the pre-pulled Docker image
2. **Add your API key** to the `.env` file that gets created:
   ```bash
   # Choose one:
   OPENAI_API_KEY=your_openai_key_here
   # OR
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

3. **Access the interface** at `http://localhost:3000`

## What You'll See

When everything is set up correctly:
```
✅ Docker image dfusco/hax-ai-cyber-lab:latest already exists
🤖 AI Tutor: Anthropic integration enabled
🚀 HAX AI Warp Server running on port 3000
📱 Interface: http://localhost:3000
```

## Troubleshooting

### "Docker image not found"
If you see this error, you missed the pre-installation steps:
```
❌ Docker image dfusco/hax-ai-cyber-lab:latest not found locally
📋 Please run the following commands first:
   1. docker login
   2. docker pull dfusco/hax-ai-cyber-lab:latest
   3. Then restart hax-ai-warp
```

**Solution**: Run the pre-installation steps above.

### "unauthorized: incorrect username or password"
- Ensure you've run `docker login` successfully
- Check your Docker Hub credentials
- Make sure you have access to pull public images

### Docker Image Info
- **Image**: `dfusco/hax-ai-cyber-lab:latest`
- **Size**: ~1.4GB
- **Base**: Ubuntu 22.04
- **Includes**: SSH server, cybersecurity tools, development environment

## Support

If you encounter issues:
1. Verify Docker Desktop is running
2. Confirm you completed all pre-installation steps
3. Check you're logged into Docker Hub: `docker info`
4. Ensure the image was pulled: `docker images | grep dfusco`

---

**Note**: The Docker image must be pulled manually before running HAX AI Warp. This ensures reliable access to the cybersecurity lab environment.
