const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthManager {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'hax-ai-warp-secret-change-in-production';
    this.sessions = new Map();
  }

  generateSessionToken(studentId, vmId) {
    const payload = {
      studentId,
      vmId,
      createdAt: new Date().toISOString()
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '8h' });
    
    this.sessions.set(token, {
      studentId,
      vmId,
      createdAt: new Date(),
      lastActivity: new Date()
    });

    return token;
  }

  validateSession(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      const session = this.sessions.get(token);
      
      if (session) {
        session.lastActivity = new Date();
        return { valid: true, studentId: decoded.studentId, vmId: decoded.vmId };
      }
      
      return { valid: false, error: 'Session not found' };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  revokeSession(token) {
    this.sessions.delete(token);
  }

  getActiveSessions() {
    return Array.from(this.sessions.entries()).map(([token, session]) => ({
      token: token.substring(0, 10) + '...',
      studentId: session.studentId,
      vmId: session.vmId,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity
    }));
  }

  cleanupExpiredSessions() {
    const now = new Date();
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours

    for (const [token, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.sessions.delete(token);
      }
    }
  }
}

module.exports = AuthManager;
