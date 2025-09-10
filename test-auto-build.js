#!/usr/bin/env node

/**
 * Test script to simulate your friend's experience
 * This tests the auto-build functionality
 */

const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('🟢 Connected to HAX AI Warp');
  
  // Create terminal (this should trigger Docker image build if needed)
  console.log('📋 Creating terminal session...');
  socket.emit('create-terminal', {}, (response) => {
    if (response.success) {
      console.log(`✅ Terminal session created: ${response.sessionId}`);
      console.log('🎉 Auto-build functionality working!');
      process.exit(0);
    } else {
      console.error('❌ Failed to create terminal session:', response.error);
      process.exit(1);
    }
  });
});

socket.on('terminal-output', (data) => {
  console.log('📟 Terminal output received (container working)');
});

socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
  process.exit(1);
});

console.log('🚀 Testing auto-build functionality...');
