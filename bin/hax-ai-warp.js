#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ASCII Art Banner
const banner = `
 ██╗  ██╗ █████╗ ██╗  ██╗      █████╗ ██╗    ██╗ █████╗ ██████╗ ██████╗ 
 ██║  ██║██╔══██╗╚██╗██╔╝     ██╔══██╗██║    ██║██╔══██╗██╔══██╗██╔══██╗
 ███████║███████║ ╚███╔╝█████╗███████║██║ █╗ ██║███████║██████╔╝██████╔╝
 ██╔══██║██╔══██║ ██╔██╗╚════╝██╔══██║██║███╗██║██╔══██║██╔══██╗██╔═══╝ 
 ██║  ██║██║  ██║██╔╝ ██╗     ██║  ██║╚███╔███╔╝██║  ██║██║  ██║██║     
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝     ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     
                                                                          
🤖 AI-Powered Cybersecurity Education Platform
`;

console.log(banner);

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...\n');
  
  let allGood = true;
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion >= 18) {
    console.log('✅ Node.js:', nodeVersion);
  } else {
    console.log('❌ Node.js: Version 18+ required, found', nodeVersion);
    allGood = false;
  }
  
  // Check Docker
  try {
    const { execSync } = require('child_process');
    const dockerVersion = execSync('docker --version', { encoding: 'utf8' }).trim();
    console.log('✅ Docker:', dockerVersion);
    
    // Check if Docker daemon is running
    try {
      execSync('docker ps', { encoding: 'utf8', stdio: 'ignore' });
      console.log('✅ Docker daemon: Running');
    } catch (error) {
      console.log('❌ Docker daemon: Not running or not accessible');
      console.log('   Please start Docker Desktop or Docker daemon');
      allGood = false;
    }
  } catch (error) {
    console.log('❌ Docker: Not found');
    console.log('   Please install Docker Desktop from https://docker.com/products/docker-desktop');
    allGood = false;
  }
  
  console.log('');
  
  if (!allGood) {
    console.log('🛑 Please install missing prerequisites and try again.\n');
    console.log('Installation Guide:');
    console.log('• Node.js 18+: https://nodejs.org/');
    console.log('• Docker Desktop: https://docker.com/products/docker-desktop');
    console.log('');
    process.exit(1);
  }
  
  return true;
}

function showUsage() {
  console.log('Usage: npx hax-ai-warp [options]\n');
  console.log('Options:');
  console.log('  --port <port>     Server port (default: 3000)');
  console.log('  --help, -h        Show this help message');
  console.log('  --version, -v     Show version');
  console.log('  --setup           Run setup wizard');
  console.log('');
  console.log('Examples:');
  console.log('  npx hax-ai-warp                 # Start on port 3000');
  console.log('  npx hax-ai-warp --port 8080     # Start on port 8080');
  console.log('  npx hax-ai-warp --setup         # Run setup wizard');
  console.log('');
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env configuration file...');
    
    const envContent = `# HAX AI Warp Configuration
# Generated on ${new Date().toISOString()}

# Student password for Docker containers
STUDENT_PASSWORD=haxwarp123

# AI Configuration (choose one)
# Get your API key from:
# - OpenAI: https://platform.openai.com/api-keys
# - Anthropic: https://console.anthropic.com/account/keys

# OpenAI Configuration
# OPENAI_API_KEY=your-openai-api-key-here

# Anthropic Configuration (recommended)
# ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration
PORT=3000

# Security (optional)
# SESSION_SECRET=your-random-session-secret
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Edit .env file to add your AI API key');
    console.log('2. Get your API key from:');
    console.log('   • OpenAI: https://platform.openai.com/api-keys');
    console.log('   • Anthropic: https://console.anthropic.com/account/keys');
    console.log('3. Run the command again to start the server');
    console.log('');
    return false;
  }
  
  return true;
}

function startServer(port = 3000) {
  const serverPath = path.join(__dirname, '..', 'server.js');
  
  console.log('🚀 Starting HAX AI Warp server...');
  console.log('📱 Interface will be available at: http://localhost:' + port);
  console.log('🔧 API endpoint: http://localhost:' + port + '/api');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('');
  
  const env = { ...process.env, PORT: port.toString() };
  
  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: env,
    cwd: path.dirname(serverPath)
  });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
  
  server.on('exit', (code) => {
    if (code !== 0) {
      console.log('');
      console.log('💡 If you encountered issues:');
      console.log('• Make sure Docker is running');
      console.log('• Ensure you have run: docker login');
      console.log('• Ensure you have run: docker pull dfusco/hax-ai-cyber-lab:latest');
      console.log('• Check that your AI API key is configured in .env');
      console.log('• Ensure port', port, 'is not already in use');
    }
    process.exit(code);
  });
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGINT');
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
let port = 3000;
let showHelp = false;
let showVersion = false;
let runSetup = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '--help':
    case '-h':
      showHelp = true;
      break;
    case '--version':
    case '-v':
      showVersion = true;
      break;
    case '--setup':
      runSetup = true;
      break;
    case '--port':
      if (i + 1 < args.length) {
        port = parseInt(args[i + 1]);
        if (isNaN(port) || port < 1 || port > 65535) {
          console.error('❌ Invalid port number:', args[i + 1]);
          process.exit(1);
        }
        i++; // Skip next argument
      } else {
        console.error('❌ --port requires a port number');
        process.exit(1);
      }
      break;
    default:
      console.error('❌ Unknown option:', arg);
      showUsage();
      process.exit(1);
  }
}

// Handle commands
if (showVersion) {
  const packageJson = require('../package.json');
  console.log('HAX AI Warp version:', packageJson.version);
  process.exit(0);
}

if (showHelp) {
  showUsage();
  process.exit(0);
}

if (runSetup) {
  console.log('🔧 Running setup wizard...\n');
  checkPrerequisites();
  createEnvFile();
  console.log('✅ Setup complete! Run without --setup to start the server.');
  process.exit(0);
}

// Main execution
try {
  checkPrerequisites();
  
  if (createEnvFile()) {
    startServer(port);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
