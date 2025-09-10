# Contributing to HAX AI Warp

Thank you for your interest in contributing to HAX AI Warp! This project aims to revolutionize cybersecurity and Linux education through AI-powered assistance.

## Ways to Contribute

### 🐛 Bug Reports
- Report issues with installation, usage, or functionality
- Include steps to reproduce, expected vs actual behavior
- Provide system information (OS, Docker version, Node.js version)

### 💡 Feature Requests
- Suggest new educational features
- Propose AI enhancement ideas
- Request additional cybersecurity tools

### 📝 Documentation
- Improve installation guides
- Add user tutorials
- Fix typos and unclear explanations

### 🔧 Code Contributions
- Fix bugs and issues
- Add new features
- Improve AI suggestions
- Enhance Docker container setup

### 🎓 Educational Content
- Add cybersecurity scenarios
- Create learning modules
- Improve AI tutoring prompts

## Getting Started

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/hax-ai-warp.git
   cd hax-ai-warp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run setup**
   ```bash
   npm run setup
   ```

5. **Start development server**
   ```bash
   npm run dev  # Uses nodemon for auto-restart
   ```

### Project Structure

```
hax-ai-warp/
├── bin/                 # NPX executable
├── lib/                 # Core libraries
│   ├── ai-tutor.js     # AI tutoring engine
│   ├── terminal-manager.js  # Terminal/Docker management
│   └── docker-container-manager.js  # Container lifecycle
├── public/             # Frontend assets
│   ├── index.html      # Main interface
│   ├── app.js          # Frontend JavaScript
│   └── styles.css      # Styling
├── scripts/            # Setup and utility scripts
├── server.js           # Main server application
└── package.json        # Dependencies and scripts
```

## Development Guidelines

### Code Style

#### JavaScript
- Use ES6+ features where appropriate
- Prefer `const` and `let` over `var`
- Use meaningful variable names
- Add JSDoc comments for functions

```javascript
/**
 * Analyzes terminal activity and provides AI suggestions
 * @param {string} studentId - Unique student identifier
 * @param {string} command - Command that was executed
 * @param {string} output - Terminal output
 * @param {string} errorOutput - Error output if any
 * @returns {Promise<Object|null>} AI suggestion object or null
 */
async analyzeTerminalActivity(studentId, command, output, errorOutput) {
  // Implementation
}
```

#### CSS
- Use meaningful class names
- Follow BEM methodology where appropriate
- Keep styles organized and commented

#### HTML
- Use semantic HTML elements
- Ensure accessibility with proper ARIA labels
- Test with screen readers

### Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make commits with clear messages**
   ```bash
   git commit -m "feat: add AI suggestion filtering for cybersec commands"
   git commit -m "fix: resolve Docker container cleanup issue"
   git commit -m "docs: update installation guide for Windows"
   ```

3. **Push branch and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

### Commit Message Convention

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

### Manual Testing

1. **Basic functionality**
   ```bash
   npm start
   # Test terminal creation
   # Test AI suggestions
   # Test Docker container management
   ```

2. **Cross-platform testing**
   - Test on macOS, Windows, Linux
   - Test different Docker configurations
   - Verify NPX installation works

3. **AI features**
   - Test with different API keys
   - Verify suggestions are relevant
   - Test error handling

### Automated Testing

```bash
# Run existing tests
npm test

# Add new tests in test/ directory
npm run test:watch  # Watch mode for development
```

## AI Development

### Improving AI Suggestions

The AI tutor is in `lib/ai-tutor.js`. Key areas for improvement:

1. **Command Recognition**
   - Add support for new cybersecurity tools
   - Improve context understanding
   - Better error pattern matching

2. **Educational Content**
   - Enhance learning explanations
   - Add progressive difficulty
   - Improve suggestion relevance

3. **Multi-language Support**
   - Add support for different programming languages
   - Locale-specific suggestions

### AI Prompt Engineering

```javascript
// Example: Adding new command support
const cybersecCommands = {
  'nmap': {
    description: 'Network mapping and port scanning tool',
    commonUsage: ['nmap -sn network/24', 'nmap -sS target'],
    learningTips: 'Start with ping scans (-sn) before port scans'
  },
  // Add more tools...
};
```

## Docker Development

### Container Improvements

1. **Adding new tools**
   ```dockerfile
   # In Dockerfile or setup scripts
   RUN apt-get update && apt-get install -y \
       new-security-tool \
       another-useful-tool
   ```

2. **Performance optimization**
   - Reduce image size
   - Improve startup time
   - Better resource management

3. **Security enhancements**
   - Container hardening
   - User permission management
   - Network isolation

## Documentation

### Writing Guidelines

1. **Be clear and concise**
   - Use simple language
   - Provide examples
   - Test instructions yourself

2. **Structure properly**
   - Use headings appropriately
   - Include table of contents for long docs
   - Cross-reference related sections

3. **Keep updated**
   - Update docs with code changes
   - Verify links work
   - Update screenshots if needed

## Pull Request Process

### Before Submitting

1. **Test thoroughly**
   - Manual testing on your platform
   - Check for console errors
   - Verify no broken functionality

2. **Update documentation**
   - Update README if needed
   - Add/update inline comments
   - Update API documentation

3. **Check code quality**
   - No console.log in production code
   - Remove debug statements
   - Follow coding standards

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (specify)

## Testing
- [ ] Tested locally
- [ ] Tested with different AI providers
- [ ] Tested Docker functionality
- [ ] Updated/added tests

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

### Communication

- **GitHub Issues**: Bug reports, feature requests
- **Discussions**: General questions, ideas
- **Pull Requests**: Code review and discussion
- **Email**: Security issues only

## Security

### Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Email security issues to: [security@hax-ai-warp.dev] (or your preferred contact)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Considerations

- AI API keys are sensitive
- Docker containers should be isolated
- Student data should remain private
- No authentication bypass vulnerabilities

## Release Process

1. **Version bumping**
   ```bash
   npm version patch  # Bug fixes
   npm version minor  # New features
   npm version major  # Breaking changes
   ```

2. **Testing**
   - Test NPX installation
   - Verify all platforms work
   - Check documentation accuracy

3. **Publishing**
   ```bash
   npm publish
   ```

## Development Resources

### Useful Commands

```bash
# Development
npm run dev          # Development server with auto-restart
npm run lint         # Code linting
npm run format       # Code formatting

# Docker
docker ps            # See running containers
docker logs <id>     # View container logs
docker exec -it <id> bash  # Enter container

# Testing
npm test            # Run tests
npm run test:ai     # Test AI functionality specifically
npm run test:docker # Test Docker integration
```

### Learning Resources

- **Docker**: https://docs.docker.com/
- **Socket.IO**: https://socket.io/docs/
- **Express.js**: https://expressjs.com/
- **xterm.js**: https://xtermjs.org/
- **OpenAI API**: https://platform.openai.com/docs
- **Anthropic API**: https://docs.anthropic.com/

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make cybersecurity education more accessible and effective! 🎓🔒
