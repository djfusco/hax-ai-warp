#!/usr/bin/env node

// Test script to simulate a terminal session
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
  
  // Simulate some commands after a delay
  setTimeout(() => {
    console.log('📝 Sending ls command...');
    socket.emit('terminal-input', {
      terminalId: data.terminalId,
      input: 'ls\r'
    });
  }, 2000);
  
  setTimeout(() => {
    console.log('📝 Sending error command...');
    socket.emit('terminal-input', {
      terminalId: data.terminalId,
      input: 'lsfds\r'
    });
  }, 5000);
});

socket.on('ai-suggestion', (suggestion) => {
  console.log('🤖 Received AI suggestion:', suggestion);
});

socket.on('terminal-output', (data) => {
  console.log('📤 Terminal output:', data.output.substring(0, 100) + '...');
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Keep the script running
setTimeout(() => {
  console.log('🏁 Test complete');
  process.exit(0);
}, 10000);
