#!/usr/bin/env node

// Minimal test to check if AI suggestions work
const io = require('socket.io-client');

console.log('Starting AI suggestion test...');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to server');
  
  socket.emit('create-terminal', {
    studentId: 'test',
    courseName: 'cybersec'
  });
});

socket.on('terminal-created', (data) => {
  console.log('✅ Terminal created:', data.terminalId);
  
  // Wait for login, then send commands
  setTimeout(() => {
    console.log('🔑 Sending password...');
    socket.emit('terminal-input', { terminalId: data.terminalId, input: 'haxwarp123\r' });
  }, 3000);
  
  setTimeout(() => {
    console.log('📝 Sending normal command...');
    socket.emit('terminal-input', { terminalId: data.terminalId, input: 'ls\r' });
  }, 8000);
  
  setTimeout(() => {
    console.log('📝 Sending error command...');
    socket.emit('terminal-input', { terminalId: data.terminalId, input: 'badcmd\r' });
  }, 11000);
});

socket.on('ai-suggestion', (suggestion) => {
  console.log('\n🎉 *** AI SUGGESTION RECEIVED *** 🎉');
  console.log('Type:', suggestion.type);
  console.log('Title:', suggestion.title);
  console.log('Message:', suggestion.message);
  console.log('Suggestion:', suggestion.suggestion);
  console.log('🎉 *** END AI SUGGESTION *** 🎉\n');
});

setTimeout(() => {
  console.log('⏰ Test completed');
  process.exit(0);
}, 15000);
