#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 HAX AI Warp Setup\n');

function checkDocker() {
  try {
    console.log('🐳 Checking Docker...');
    const version = execSync('docker --version', { encoding: 'utf8' }).trim();
    console.log('✅ Docker found:', version);
    
    // Check if Docker daemon is running
    try {
      execSync('docker ps', { encoding: 'utf8', stdio: 'ignore' });
      console.log('✅ Docker daemon is running');
    } catch (error) {
      console.log('⚠️  Docker daemon not running. Please start Docker Desktop.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Docker not found. Please install Docker Desktop from https://docker.com');
    return false;
  }
}

function createEnvIfNeeded() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('\n📝 Creating default .env configuration...');
    
    const envTemplate = `# HAX AI Warp Configuration
# Generated: ${new Date().toISOString()}

# Default student password for Docker containers
STUDENT_PASSWORD=haxwarp123

# AI Configuration - Add your API key below
# OpenAI: Get from https://platform.openai.com/api-keys
# OPENAI_API_KEY=your-openai-api-key-here

# Anthropic Claude: Get from https://console.anthropic.com/account/keys
# ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration
PORT=3000
`;
    
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env file with default configuration');
    
    return false; // Indicates user needs to configure
  }
  
  console.log('✅ .env file already exists');
  return true;
}

function pullDockerImage() {
  console.log('\n🐳 Preparing Docker environment...');
  console.log('This may take a few minutes on first run...');
  
  try {
    // Check if we have Ubuntu image
    try {
      execSync('docker image inspect ubuntu:22.04', { stdio: 'ignore' });
      console.log('✅ Ubuntu 22.04 image already available');
    } catch (error) {
      console.log('📥 Downloading Ubuntu 22.04 image...');
      execSync('docker pull ubuntu:22.04', { stdio: 'inherit' });
      console.log('✅ Ubuntu 22.04 image downloaded');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to prepare Docker image:', error.message);
    return false;
  }
}

function showNextSteps() {
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. 🔑 Add your AI API key to the .env file:');
  console.log('   • OpenAI: https://platform.openai.com/api-keys');
  console.log('   • Anthropic: https://console.anthropic.com/account/keys');
  console.log('');
  console.log('2. 🚀 Start the server:');
  console.log('   npm start');
  console.log('   # or if installed globally:');
  console.log('   npx hax-ai-warp');
  console.log('');
  console.log('3. 🌐 Open your browser to:');
  console.log('   http://localhost:3000');
  console.log('');
  console.log('💡 The AI features require an API key to function fully.');
  console.log('   Without one, the system will use basic pattern matching.');
}

// Main setup process
async function main() {
  let success = true;
  
  // Check Docker
  if (!checkDocker()) {
    success = false;
  }
  
  // Create .env file
  const envConfigured = createEnvIfNeeded();
  
  // Pull Docker image if Docker is available
  if (success) {
    if (!pullDockerImage()) {
      success = false;
    }
  }
  
  if (success) {
    showNextSteps();
  } else {
    console.log('\n⚠️  Setup completed with warnings.');
    console.log('Please address the issues above before starting the server.');
  }
  
  if (!envConfigured) {
    console.log('\n🔧 Remember to configure your AI API key in the .env file!');
  }
}

main().catch(console.error);
