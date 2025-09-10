FROM ubuntu:22.04

# Set non-interactive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install essential tools for cybersecurity education
RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    curl \
    wget \
    vim \
    nano \
    net-tools \
    iputils-ping \
    nmap \
    netcat \
    tcpdump \
    wireshark-common \
    john \
    hydra \
    python3 \
    python3-pip \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Create student user with sudo privileges
RUN useradd -m -s /bin/bash student && \
    echo 'student:haxwarp123' | chpasswd && \
    usermod -aG sudo student

# Set up SSH
RUN mkdir /var/run/sshd && \
    echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config && \
    echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config && \
    sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

# Create welcome files for students
RUN echo "Welcome to HAX AI Cybersecurity Lab!" > /home/student/README.txt && \
    echo "Available tools: nmap, netcat, tcpdump, wireshark, john, hydra" >> /home/student/README.txt && \
    echo "Default password: haxwarp123" >> /home/student/README.txt && \
    chown student:student /home/student/README.txt

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
