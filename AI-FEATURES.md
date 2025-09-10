## AI Assistant Examples

### Without API Key (Pattern-Matching Mode)
The system provides intelligent responses based on built-in cybersecurity knowledge:

**Command**: `nmap -df 127.0.0.1`
**Error**: `Invalid argument to -d: 'f'. QUITTING!`
**AI Response**:
```
🎯 Nmap Syntax Error
Invalid nmap syntax detected. Common nmap flags are case-sensitive.
Suggestion: Try: nmap -sS [target] for SYN scan, or nmap -sV [target] for version detection
Reasoning: Common nmap scans: -sS (stealth), -sV (version), -A (aggressive), -p (ports)
```

**Command**: `sudo service apache2 start`
**Output**: `Starting Apache HTTP server...`
**AI Response**:
```
🌐 Service Management
Managing services is key to both attack and defense.
Suggestion: Check status: systemctl status [service], logs: journalctl -u [service]
Reasoning: Understanding service states helps identify vulnerabilities and monitor security
```

### With API Key (Full AI Mode)
When you set OPENAI_API_KEY or ANTHROPIC_API_KEY, the AI provides dynamic, context-aware responses like Warp.dev:

**Command**: `nmap -p 80,443 scanme.nmap.org`
**AI Response** (example):
```
🤖 AI Assistant
Great choice! You're performing a targeted scan on common web ports. This is a fundamental reconnaissance technique in cybersecurity. The scan will check if HTTP (80) and HTTPS (443) services are running. 

Next steps: Try nmap -sV -p 80,443 scanme.nmap.org to detect service versions, or add -A for aggressive scanning to gather more detailed information about the target.
```

## How It Works

1. **Terminal Monitoring**: Every command and output is analyzed in real-time
2. **Error Detection**: Advanced pattern matching identifies issues and common mistakes
3. **Context Awareness**: AI considers command history and current learning objectives
4. **Educational Guidance**: Responses focus on building cybersecurity knowledge
5. **Next Steps**: Always suggests logical progression in learning

## Comparison

| Feature | Pattern-Matching Mode | Full AI Mode |
|---------|----------------------|--------------|
| Error Detection | ✅ Built-in patterns | ✅ Advanced AI analysis |
| Tool Guidance | ✅ Cybersecurity focused | ✅ Dynamic & contextual |
| Learning Tips | ✅ Educational focus | ✅ Personalized guidance |
| Response Speed | ⚡ Instant | 🚀 ~1-2 seconds |
| Setup Required | ❌ None | ✅ API key needed |
| Cost | 🆓 Free | 💰 API usage |

Both modes provide valuable educational support, with Full AI Mode offering the complete Warp.dev-like experience.
