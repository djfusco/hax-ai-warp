#!/usr/bin/env node

// Test the AI suggestions manually
const AITutor = require('./lib/ai-tutor');

async function testAISuggestions() {
  console.log('🧪 Testing AI Suggestions for Warp.dev-like experience\n');
  
  const tutor = new AITutor();
  
  // Test the exact commands from the server logs
  const testCommands = [
    {
      command: 'nmap --fsa',
      output: '',
      error: 'nmap: unrecognized option \'--fsa\'\nSee the output of nmap -h for a summary of options.'
    },
    {
      command: 'nmap -djf 128.0.0.1',
      output: '',
      error: 'Invalid argument to -d: "f".\nQUITTING!'
    },
    {
      command: 'ls -la',
      output: 'total 8\ndrwxr-xr-x  2 student student 4096 Sep  9 14:30 .\ndrwxr-xr-x 19 student student 4096 Sep  9 14:30 ..',
      error: ''
    }
  ];
  
  for (const test of testCommands) {
    console.log(`\n🔍 Testing: ${test.command}`);
    console.log(`   Error: ${test.error || '(none)'}`);
    
    const suggestion = await tutor.analyzeTerminalActivity(
      'test-student',
      test.command,
      test.output,
      test.error
    );
    
    if (suggestion) {
      console.log(`\n   ✅ AI Response:`);
      console.log(`   📁 Type: ${suggestion.type}`);
      console.log(`   🎯 Title: ${suggestion.title}`);
      console.log(`   💬 Message: ${suggestion.message}`);
      console.log(`   🔧 Suggestion: ${suggestion.suggestion}`);
      console.log(`   🧠 Reasoning: ${suggestion.reasoning}`);
    } else {
      console.log('   ❌ No suggestion generated');
    }
  }
  
  console.log('\n🎯 Summary:');
  console.log('The AI should respond to:');
  console.log('- Command errors (like invalid nmap flags)');
  console.log('- Successful commands (with next steps)');
  console.log('- Learning opportunities');
  console.log('\nThese responses should appear in the "AI Cybersecurity Tutor" box in your browser!');
}

testAISuggestions().catch(console.error);
