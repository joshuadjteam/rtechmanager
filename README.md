# rTechManager

Simple and powerful management console for Linux Mint servers.

## Features
- **Remote Desktop**: Direct VNC relay via noVNC/Websockify for full desktop control.
- **Hardware Monitoring**: Real-time visualization of CPU, RAM, and Disk performance.
- **System Administration**: Manage users, virtualization (KVM/QEMU), network interfaces, and system logs.
- **Native Security**: Secure access using standard PAM (Linux System) authentication.
- **Bash Terminal**: Fully interactive web-based terminal for command-line access.

## Quick Installation
1. Install system dependencies (Git, Node.js, VNC, etc.) as listed in `setup.txt`.
2. Clone the repository: `git clone https://github.com/joshuadjteam/rtechmanager`
3. Enter the directory and install components: `npm install && npm run build`
4. Start the server: `node server.js`

## Technical Specifications
- **Console Port**: 1783
- **Authentication**: System-level PAM (Pluggable Authentication Modules)
- **VNC Backend**: TightVNC on display :1
- **WebSocket Bridge**: Websockify (Port 6080)
- **Frontend**: React 19 + Tailwind CSS
- **Backend**: Node.js + Express