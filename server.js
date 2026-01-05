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

  console.log(`[rTech] Initializing Manager...`);

  const bootstrapServices = () => {
    try {
      // Start VNC if not running
      const vncCheck = spawnSync('pgrep', ['-f', 'Xtightvnc|vncserver']);
      if (vncCheck.status !== 0) {
        console.log('[rTech] Starting VNC Server...');
        spawn('vncserver', [':1', '-geometry', '1280x720', '-depth', '24'], { detached: true, stdio: 'ignore' }).unref();
      }

      // Start Websockify bridge if not running
      const wsCheck = spawnSync('pgrep', ['-f', 'websockify']);
      if (wsCheck.status !== 0) {
        console.log('[rTech] Starting Websockify Bridge...');
        spawn('websockify', ['--web', '/usr/share/novnc/', '6080', 'localhost:5901'], { detached: true, stdio: 'ignore' }).unref();
      }
    } catch (err) {
      console.error('[rTech] Bootstrap Error:', err.message);
    }
  };

  bootstrapServices();

  app.use(bodyParser.json());
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    pam.authenticate(username, password, (err) => {
      if (err) return res.status(401).json({ error: 'System Authentication Failed' });
      res.json({ username, isRoot: username === 'root' || username === 'admin' });
    });
  });

  const vncProxy = createProxyServer({ target: 'ws://localhost:6080', ws: true });
  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/vnc')) vncProxy.ws(req, socket, head);
  });

  server.listen(port, host, () => {
    console.log(`[rTech] Operational at http://${host}:${port}`);
  });

} catch (e) {
  console.error('Fatal:', e.message);
  process.exit(1);
}