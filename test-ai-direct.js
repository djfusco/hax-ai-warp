#!/usr/bin/env node

// Test script to directly test AI functionality
require('dotenv').config();

const AITutor = require('./lib/ai-tutor');

async function testAI() {
  console.log('🧪 Testing AI Tutor functionality...');
  
  const aiTutor = new AITutor();
  
  // Test with a simple command
  console.log('Testing with "ls" command...');
  
  const result = await aiTutor.analyzeTerminalActivity(
    'test-student',
    'ls',
    'README.txt\nindex.html\napp.js',
    null
  );
  
  console.log('AI Result:', result);
  
  // Test with an error command
  console.log('\nTesting with error command...');
  
  const errorResult = await aiTutor.analyzeTerminalActivity(
    'test-student',
    'lsfds',
    '-bash: lsfds: command not found',
    '-bash: lsfds: command not found'
  );
  
  console.log('Error Result:', errorResult);
}

testAI().catch(console.error);
