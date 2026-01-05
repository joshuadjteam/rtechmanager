
const { spawn, execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * rTechManager - Core Server
 * Handles: System Auth, Static UI, VNC Proxy, and Background Service Management
 */

try {
  const express = require('express');
  const bodyParser = require('body-parser');
  const pam = require('authenticate-pam');
  const http = require('http');
  const { createProxyServer } = require('http-proxy');

  const app = express();
  const server = http.createServer(app);
  const port = 1783;
  const host = '0.0.0.0';

  console.log(`[rTech] Initializing Manager on Node ${process.version}...`);

  /**
   * Automatically manage background VNC services
   * Ensures VNC and Websockify are running in detached background mode.
   */
  const bootstrapServices = () => {
    try {
      // 1. Ensure VNC Server is running on :1 (Port 5901)
      const vncCheck = spawnSync('pgrep', ['-f', 'Xtightvnc']);
      if (vncCheck.status !== 0) {
        console.log('[rTech] Starting TightVNC Server on :1...');
        const vnc = spawn('vncserver', [':1'], { detached: true, stdio: 'ignore' });
        vnc.unref();
      } else {
        console.log('[rTech] TightVNC Server detected (Active).');
      }

      // 2. Ensure Websockify Bridge is running (Port 6080)
      const wsCheck = spawnSync('pgrep', ['-f', 'websockify']);
      if (wsCheck.status !== 0) {
        console.log('[rTech] Starting Websockify Bridge (6080 -> 5901)...');
        const bridge = spawn('websockify', ['--web', '/usr/share/novnc/', '6080', 'localhost:5901'], {
          detached: true,
          stdio: 'ignore'
        });
        bridge.unref();
      } else {
        console.log('[rTech] Websockify Bridge detected (Active).');
      }
    } catch (err) {
      console.error('[rTech] Bootstrap Warning:', err.message);
    }
  };

  bootstrapServices();

  app.use(bodyParser.json());

  // Serve static UI from dist
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error(`[rTech] ERROR: 'dist' folder not found at ${distPath}. Did you run 'npm run build'?`);
    // Create a dummy index if it's missing to prevent crash, but warn heavily
    fs.mkdirSync(distPath, { recursive: true });
    fs.writeFileSync(path.join(distPath, 'index.html'), '<h1>rTechManager: Please run "npm run build" to generate UI</h1>');
  }

  app.use(express.static(distPath));

  // Authentication via System PAM
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    pam.authenticate(username, password, (err) => {
      if (err) {
        console.warn(`[rTech] Auth Failure for user: ${username}`);
        return res.status(401).json({ error: 'System Authentication Failed' });
      }
      console.log(`[rTech] Auth Success: ${username}`);
      res.json({ username, isRoot: username === 'root' || username === 'admin' });
    }, { serviceName: 'login', remoteHost: 'localhost' });
  });

  // VNC WebSocket Proxy
  const vncProxy = createProxyServer({ target: 'ws://localhost:6080', ws: true });
  vncProxy.on('error', (err) => console.error('[rTech] VNC Proxy Error:', err.message));

  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/vnc')) {
      vncProxy.ws(req, socket, head);
    }
  });

  server.listen(port, host, () => {
    console.log(`[rTech] Web UI ACTIVE on http://${host}:${port}`);
    console.log(`[rTech] Infrastructure operational.`);
  });

  // Keep-alive logging for systemd visibility
  setInterval(() => {
    console.log(`[rTech] Heartbeat - Uptime: ${Math.floor(process.uptime())}s`);
  }, 60000);

} catch (e) {
  console.error('#########################################');
  console.error('FATAL STARTUP ERROR:', e.message);
  console.error('Check if all npm modules are installed.');
  console.error('#########################################');
  process.exit(1);
}
