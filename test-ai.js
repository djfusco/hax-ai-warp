#!/usr/bin/env node

// Quick test script for AI functionality
const AITutor = require('./lib/ai-tutor');

async function testAI() {
  console.log('🧪 Testing HAX AI Warp - AI Tutor Functionality\n');
  
  const tutor = new AITutor();
  
  // Test scenarios
  const testCases = [
    {
      command: 'nmap -df 127.0.0.1',
      output: '',
      error: 'Invalid argument to -d: \'f\'. QUITTING!'
    },
    {
      command: 'sudo nmap -sS 192.168.1.1',
      output: 'Starting Nmap 7.94 ( https://nmap.org ) at 2025-09-09 10:30 EDT\nNmap scan report for 192.168.1.1\nHost is up (0.0010s latency).\nNmap done: 1 IP address (1 host up) scanned in 0.25 seconds',
      error: ''
    },
    {
      command: 'john hashfile.txt',
      output: 'Loaded 1 password hash (LM [DES 128/128 AVX])\nPress \'q\' or Ctrl-C to abort, almost any other key for status',
      error: ''
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📝 Testing command: ${testCase.command}`);
    console.log(`   Error: ${testCase.error || 'none'}`);
    
    try {
      const result = await tutor.analyzeTerminalActivity(
        'test-student',
        testCase.command,
        testCase.output,
        testCase.error
      );
      
      console.log(`   ✅ AI Response:`);
      console.log(`      Type: ${result.type}`);
      console.log(`      Title: ${result.title}`);
      console.log(`      Message: ${result.message}`);
      console.log(`      Suggestion: ${result.suggestion}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎯 Test complete!');
  console.log('\n💡 To enable full AI features:');
  console.log('   1. Get an API key from OpenAI or Anthropic');
  console.log('   2. Set OPENAI_API_KEY or ANTHROPIC_API_KEY environment variable');
  console.log('   3. Restart the server');
  console.log('\n🚀 Run: PORT=3000 node server.js to start the server');
}

if (require.main === module) {
  testAI().catch(console.error);
}

module.exports = testAI;
