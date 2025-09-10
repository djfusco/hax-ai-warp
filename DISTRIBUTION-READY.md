# HAX AI Warp - Installation Guide

HAX AI Warp automatically builds its Docker environment on first run - no manual setup required!

## Prerequisites

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Docker Desktop** - [Download from docker.com](https://docker.com/products/docker-desktop)
- **API Key** from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/account/keys)

## Quick Installation

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

## First Time Setup

1. **Start Docker Desktop** and ensure it's running
2. **Run the application** - it will automatically:
   - Build the Docker image `hax-ai-cyber-lab:latest` from Ubuntu 22.04 (~5-10 minutes)
   - Create the `.env` configuration file
   - Set up the cybersecurity lab environment

3. **Add your API key** to the `.env` file:
   ```bash
   # Choose one:
   OPENAI_API_KEY=your_openai_key_here
   # OR
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

4. **Access the interface** at `http://localhost:3000`

## What Happens Automatically

- ✅ **Docker image built locally** - Creates cybersecurity lab environment
- ✅ **No external dependencies** - Everything builds from Ubuntu base image
- ✅ **Consistent environment** - Same setup across all installations
- ✅ **One-time build** - Image reused for all subsequent runs

## Troubleshooting

### First Time Build
The initial Docker image build takes 5-10 minutes and downloads ~500MB. This is normal and only happens once.

### "Docker image not found"
If you see build errors:
1. Ensure Docker Desktop is running
2. Check internet connection (needed for Ubuntu base image)
3. Ensure you have ~2GB free disk space
4. Try: `docker system prune` to clean up space

### Build Progress
You'll see messages like:
```
🔨 Docker image hax-ai-cyber-lab:latest not found, building...
Building cybersecurity lab Docker image...
```

This is normal - the system is creating your lab environment.

## Support

If you encounter issues:
1. Check Docker Desktop is running
2. Ensure sufficient disk space (~2GB)
3. Check the terminal for build progress
4. Wait for the initial build to complete

---

**Note**: The Docker image build happens automatically on first run. This is a one-time process that takes 5-10 minutes.
