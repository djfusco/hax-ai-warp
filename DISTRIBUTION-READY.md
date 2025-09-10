# HAX AI Warp - Installation with Published Docker Image

This version of HAX AI Warp uses a published Docker image from Docker Hub, so no local Docker build is required.

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
   - Download the Docker image `dfusco/hax-ai-cyber-lab:latest` from Docker Hub (~1.4GB)
   - Create the `.env` configuration file
   - Set up the development environment

3. **Add your API key** to the `.env` file:
   ```bash
   # Choose one:
   OPENAI_API_KEY=your_openai_key_here
   # OR
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

4. **Access the interface** at `http://localhost:3000`

## What's Different

- ✅ **No Docker build required** - Uses pre-built image from Docker Hub
- ✅ **Faster startup** - No need to compile the cybersecurity lab environment
- ✅ **Consistent environment** - Same image across all installations
- ✅ **Automatic updates** - Pull latest image version when available

## Troubleshooting

### "Docker image not found"
This error should no longer occur with the published image. If you see it:
1. Ensure Docker Desktop is running
2. Check internet connection (needed to pull from Docker Hub)
3. Try manually pulling: `docker pull dfusco/hax-ai-cyber-lab:latest`

### Docker Hub Image Info
- **Image**: `dfusco/hax-ai-cyber-lab:latest`
- **Size**: ~1.4GB
- **Base**: Ubuntu 22.04
- **Includes**: SSH server, cybersecurity tools, development environment

## Support

If you encounter issues:
1. Check [troubleshooting guide](./TROUBLESHOOTING.md)
2. Verify Docker Desktop is running
3. Ensure you have internet access for initial image download
4. Check the logs in the terminal for specific error messages

---

**Note**: The Docker image will be downloaded automatically on first run. This is a one-time download of approximately 1.4GB.
