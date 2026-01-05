const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

  console.log(`[rTech] rTechManager v1.1 Starting...`);

  const bootstrapServices = () => {
    try {
      // 1. Manage VNC Server (:1 is display port 5901)
      // We check for Xtightvnc which is the actual binary name on Mint/Ubuntu
      const vncCheck = spawnSync('pgrep', ['-f', 'Xtightvnc|vncserver']);
      if (vncCheck.status !== 0) {
        console.log('[rTech] Starting VNC Server on :1 (1280x720)...');
        // If vncserver fails, it might need the password file initialized via 'vncpasswd'
        spawn('vncserver', [':1', '-geometry', '1280x720', '-depth', '24'], { 
          detached: true, 
          stdio: 'ignore',
          env: { ...process.env, USER: process.env.USER || 'root' }
        }).unref();
      } else {
        console.log('[rTech] VNC Engine already active.');
      }

      // 2. Manage Websockify (Bridge between Web and VNC)
      const wsCheck = spawnSync('pgrep', ['-f', 'websockify']);
      if (wsCheck.status !== 0) {
        console.log('[rTech] Starting Websockify Bridge on port 6080...');
        // Standard Mint path for noVNC web files
        const novncPath = '/usr/share/novnc/';
        spawn('websockify', ['--web', novncPath, '6080', 'localhost:5901'], { 
          detached: true, 
          stdio: 'ignore' 
        }).unref();
      } else {
        console.log('[rTech] Websockify Bridge already active.');
      }
    } catch (err) {
      console.error('[rTech] Bootstrap Warning:', err.message);
    }
  };

  bootstrapServices();

  app.use(bodyParser.json());
  
  // Serve the React frontend from the /dist folder
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  } else {
    console.warn(`[rTech] WARNING: 'dist' folder not found. Run 'npm run build' to generate the UI.`);
    app.get('/', (req, res) => res.send('<h1>System Ready. Run "npm run build" to enable UI.</h1>'));
  }

  // PAM Authentication Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    pam.authenticate(username, password, (err) => {
      if (err) {
        console.log(`[rTech] Auth Failure for user: ${username}`);
        return res.status(401).json({ error: 'Invalid System Credentials' });
      }
      console.log(`[rTech] Auth Success: ${username}`);
      res.json({ 
        username, 
        isRoot: username === 'root' || username === 'admin' 
      });
    }, { serviceName: 'login', remoteHost: 'localhost' });
  });

  // Proxy WebSocket connections for VNC
  const vncProxy = createProxyServer({ target: 'ws://localhost:6080', ws: true });
  vncProxy.on('error', (e) => console.error('[rTech] VNC Proxy Error:', e.message));

  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/vnc')) {
      vncProxy.ws(req, socket, head);
    }
  });

  server.listen(port, host, () => {
    console.log(`[rTech] WEB DASHBOARD: http://${host}:${port}`);
    console.log(`[rTech] CTRL+C to stop the manager.`);
  });

} catch (e) {
  console.error('#########################################');
  console.error('FATAL SERVER ERROR:', e.message);
  console.error('#########################################');
  process.exit(1);
}