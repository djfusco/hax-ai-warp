# User Guide

## Getting Started

### Access the Platform

1. **Start HAX AI Warp** (your instructor will provide the URL)
   - Usually: `http://localhost:3000` or your instructor's server
   
2. **Enter your information**:
   - **Student ID**: Your unique identifier (e.g., `john_doe`, `student123`)
   - **Course Name**: The course you're taking (e.g., `cybersec101`, `linux_basics`)

3. **Click "Connect to Terminal"**
   - A Docker container will be created for you
   - This may take 30-60 seconds on first connection

### Your Learning Environment

Once connected, you'll have:
- **🖥️ Linux Terminal**: Full Ubuntu 22.04 environment
- **🤖 AI Assistant**: Provides real-time help and suggestions
- **🔒 Isolated Environment**: Your own private container
- **🛠️ Pre-installed Tools**: Common cybersecurity and development tools

## Using the Terminal

### Basic Navigation

```bash
# Show current directory
pwd

# List files and directories
ls
ls -la  # Detailed listing

# Change directory
cd Documents
cd ..        # Go up one level
cd ~         # Go to home directory

# Create directories
mkdir my_project

# Create files
touch README.txt
echo "Hello World" > hello.txt
```

### File Operations

```bash
# View file contents
cat README.txt
less large_file.txt  # Paginated view
head -10 file.txt    # First 10 lines
tail -10 file.txt    # Last 10 lines

# Copy and move files
cp source.txt destination.txt
mv old_name.txt new_name.txt

# Remove files (be careful!)
rm file.txt
rm -rf directory/  # Remove directory and contents
```

### Getting Help

```bash
# Manual pages
man ls        # Help for 'ls' command
man -k search # Search manual pages

# Command help
ls --help
command --help

# Which command
which python3
whereis gcc
```

## AI Assistant Features

### Automatic Suggestions

The AI assistant watches your terminal activity and provides suggestions when:

- **You make a typo**: `lss` → AI suggests "Did you mean `ls`?"
- **Command fails**: `permission denied` → AI explains permissions and suggests `sudo`
- **You're stuck**: Long pause → AI offers next steps or common commands
- **Learning opportunities**: After successful commands → AI explains what happened

### Types of AI Help

**🚨 Error Help**
```bash
student@container:~$ lss
-bash: lss: command not found

# AI suggests: "Did you mean 'ls'? This command lists directory contents."
```

**💡 Learning Tips**
```bash
student@container:~$ ls -la
# AI explains: "The -la flags show all files (including hidden) with detailed permissions and ownership."
```

**🎯 Next Steps**
```bash
student@container:~$ cd /var/log
# AI suggests: "Try 'ls -la' to see log files, or 'tail -f syslog' to watch real-time logs."
```

**📦 Tool Help**
```bash
student@container:~$ nmap
# AI explains: "nmap is a network scanner. Try 'nmap -sn 192.168.1.0/24' to scan for hosts on your network."
```

## Cybersecurity Tools

Your environment includes common cybersecurity tools:

### Network Analysis

```bash
# Network scanning
nmap -sn 192.168.1.0/24    # Ping scan
nmap -sS target_ip         # SYN scan
nmap -sV target_ip         # Version detection

# Network utilities
netstat -tulpn             # Show listening ports
ss -tlnp                   # Modern netstat
ping google.com            # Test connectivity
traceroute google.com      # Trace network path

# Packet capture
tcpdump -i eth0            # Capture packets
wireshark                  # GUI packet analyzer (if X11 available)
```

### System Analysis

```bash
# Process monitoring
ps aux                     # Show all processes
top                        # Real-time process monitor
htop                       # Enhanced process monitor

# System information
uname -a                   # System information
lsb_release -a            # Distribution info
free -h                    # Memory usage
df -h                      # Disk usage
```

### Security Tools

```bash
# Password tools
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
hashcat -m 0 -a 0 hashes.txt wordlist.txt

# Network tools
nikto -h target_ip         # Web vulnerability scanner
dirb http://target_ip      # Directory bruteforcer
sqlmap -u "http://target/?id=1"  # SQL injection testing
```

## Common Tasks

### Working with Files

```bash
# Download files
wget https://example.com/file.zip
curl -O https://example.com/file.txt

# Extract archives
tar -xzf archive.tar.gz
unzip file.zip

# Search in files
grep "password" *.txt
grep -r "TODO" ./project/

# File permissions
chmod 755 script.sh       # Make executable
chmod 600 private_key     # Read/write for owner only
chown user:group file.txt
```

### Programming and Development

```bash
# Python
python3 script.py
pip3 install requests

# Compiling C/C++
gcc -o program program.c
g++ -o program program.cpp

# Text editors
nano simple_file.txt      # Simple editor
vim advanced_file.txt     # Advanced editor
```

### Network Configuration

```bash
# Network interfaces
ip addr show               # Show IP addresses
ip route show             # Show routing table

# DNS
nslookup google.com
dig google.com
```

## Best Practices

### Security Awareness

1. **🔐 Never use real passwords** - This is a learning environment
2. **🚫 Don't scan real networks** - Only use designated lab networks
3. **📚 Always understand commands** - Ask the AI if you're unsure
4. **🧹 Clean up after yourself** - Remove sensitive files when done

### Learning Effectively

1. **📝 Take notes** - Document commands that work
2. **🔄 Practice repetition** - Repeat commands until comfortable
3. **🤔 Ask questions** - Use the AI assistant liberally
4. **🧪 Experiment safely** - This environment is safe to break

### Working with AI

1. **💬 Read AI suggestions** - They're tailored to your situation
2. **🎯 Try suggested commands** - They're safe in this environment
3. **📖 Learn from explanations** - Understand why commands work
4. **🔄 Build on suggestions** - Use AI help to go deeper

## Troubleshooting

### Terminal Issues

**Terminal not responding**
- Refresh the browser page
- Check your internet connection
- Restart your terminal session

**Commands not working**
- Check spelling carefully
- Make sure you're in the right directory (`pwd`)
- Check if you need `sudo` for system commands

**Permission denied errors**
```bash
# Use sudo for system operations
sudo command_here

# Check file permissions
ls -la filename

# Make files executable
chmod +x script.sh
```

### Connection Issues

**Can't connect to terminal**
- Wait 30-60 seconds for container setup
- Refresh the browser
- Check with your instructor

**Session disconnected**
- Browser refresh usually reconnects
- Your work in the container is preserved
- If problems persist, create a new session

### Getting Help

**AI not responding**
- Try typing a command that generates an error
- AI responds to actual terminal activity
- Check if AI features are enabled by your instructor

**Need human help**
- Ask your instructor or classmates
- Check the course documentation
- Use `man command_name` for built-in help

## Advanced Features

### Multiple Sessions

You can have multiple terminal sessions:
- Open HAX AI Warp in multiple browser tabs
- Each tab connects to the same container
- Useful for monitoring logs while working

### File Transfer

```bash
# Copy text from local machine
# Paste directly into terminal

# Save work to text files
echo "my commands" > my_work.txt
cat my_work.txt  # View later
```

### Customization

```bash
# Customize bash prompt
export PS1="\u@\h:\w$ "

# Create aliases
alias ll="ls -la"
alias grep="grep --color=auto"

# Save aliases to .bashrc
echo 'alias ll="ls -la"' >> ~/.bashrc
```

## Session Management

### Saving Your Work

```bash
# Create a work directory
mkdir ~/my_work
cd ~/my_work

# Save important commands
history > my_commands.txt

# Save output of commands
command > output.txt
command 2>&1 | tee output_and_errors.txt
```

### Session Cleanup

When you're done:
- Save important files to your notes
- Clean up temporary files
- Log out cleanly with `exit`

Your container will be automatically cleaned up when you disconnect.

## Tips for Success

### Learning Strategy

1. **Start with basics** - Master file navigation first
2. **Read error messages** - They usually tell you what's wrong
3. **Use the AI** - It's there to help you learn faster
4. **Practice regularly** - Command line skills need repetition
5. **Understand before proceeding** - Don't just copy commands

### Command Line Efficiency

```bash
# Use tab completion
ls Doc[TAB]  # Completes to Documents/

# Command history
history              # Show command history
!123                # Repeat command #123
!!                  # Repeat last command
!ls                 # Repeat last ls command

# Keyboard shortcuts
Ctrl+C              # Cancel current command
Ctrl+L              # Clear screen
Ctrl+R              # Search command history
```

### Documentation

- Keep a learning journal of new commands
- Screenshot interesting AI suggestions
- Note down useful command combinations
- Create your own reference sheet

Remember: The goal is to learn and understand, not just complete tasks. Use the AI assistant to deepen your understanding of Linux and cybersecurity concepts!
