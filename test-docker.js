const HaxAIWarpServer = require('./server');
const DockerContainerManager = require('./lib/docker-container-manager');

async function testDockerIntegration() {
  console.log('🧪 Testing HAX AI Warp Docker Integration\n');
  
  const containerManager = new DockerContainerManager();
  
  try {
    // Test 1: Check Docker availability
    console.log('1. Testing Docker availability...');
    const { exec } = require('child_process');
    await new Promise((resolve, reject) => {
      exec('docker --version', (error, stdout) => {
        if (error) reject(error);
        else {
          console.log(`   ✅ Docker found: ${stdout.trim()}`);
          resolve();
        }
      });
    });
    
    // Test 2: Check if image exists
    console.log('\n2. Checking cybersecurity lab image...');
    try {
      await new Promise((resolve, reject) => {
        exec('docker images hax-ai-cyber-lab --format "{{.Repository}}:{{.Tag}}"', (error, stdout) => {
          if (error) reject(error);
          else {
            if (stdout.trim()) {
              console.log('   ✅ Cybersecurity lab image found');
            } else {
              console.log('   ⚠️  Image not found, will build on first use');
            }
            resolve();
          }
        });
      });
    } catch (error) {
      console.log('   ⚠️  Image not found, will build on first use');
    }
    
    // Test 3: List existing containers
    console.log('\n3. Checking existing containers...');
    const containers = await containerManager.listContainers();
    console.log(`   📊 Found ${containers.length} containers`);
    
    if (containers.length > 0) {
      containers.slice(0, 3).forEach(container => {
        console.log(`   - ${container.Names} (${container.State})`);
      });
      if (containers.length > 3) {
        console.log(`   ... and ${containers.length - 3} more`);
      }
    }
    
    console.log('\n✅ Docker integration test completed successfully!');
    console.log('\n🚀 Ready to start server with: npm start');
    console.log('📱 Or test locally at: http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Docker integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure Docker Desktop is running');
    console.log('   2. Check Docker permissions: docker ps');
    console.log('   3. Run setup again: npm run setup');
  }
}

testDockerIntegration();
