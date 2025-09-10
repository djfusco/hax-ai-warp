#!/usr/bin/env node

// Test script to simulate a proper terminal session with login
const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('🔌 Connected to server');
  
  // Create a terminal session
  socket.emit('create-terminal', {
    studentId: 'test-student',
    courseName: 'test-course'
  });
});

socket.on('terminal-created', (data) => {
  console.log('📺 Terminal created:', data.terminalId);
  
  // Simulate login sequence
  setTimeout(() => {
    console.log('🔑 Sending password...');
    socket.emit('terminal-input', {
      terminalId: data.terminalId,
      input: 'haxwarp123\r'
    });
  }, 3000);
  
  // Then send actual commands after login
  setTimeout(() => {
    console.log('📝 Sending ls command...');
    socket.emit('terminal-input', {
      terminalId: data.terminalId,
      input: 'ls\r'
    });
  }, 6000);
  
  setTimeout(() => {
    console.log('📝 Sending error command...');
    socket.emit('terminal-input', {
      terminalId: data.terminalId,
      input: 'lsfds\r'
    });
  }, 9000);
});

socket.on('ai-suggestion', (suggestion) => {
  console.log('🤖 *** AI SUGGESTION RECEIVED ***:', suggestion);
});

socket.on('terminal-output', (data) => {
  // Only show important output to reduce noise
  if (data.output.includes('$') || data.output.includes('Welcome') || data.output.includes('command not found')) {
    console.log('📤 Important output:', data.output.trim());
  }
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Keep the script running longer
setTimeout(() => {
  console.log('🏁 Test complete');
  process.exit(0);
}, 15000);
