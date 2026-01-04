
try {
  const express = require('express');
  const bodyParser = require('body-parser');
  const pam = require('authenticate-pam');
  const http = require('http');
  const { createProxyServer } = require('http-proxy');
  const path = require('path');
  const fs = require('fs');

  const app = express();
  const server = http.createServer(app);
  const port = 1783;
  const host = '0.0.0.0';

  console.log(`Starting rTechManager on Node ${process.version}...`);

  app.use(bodyParser.json());

  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.warn('CRITICAL: "dist" folder missing. Application UI will not load.');
    if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });
  }

  app.use(express.static(distPath));

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    pam.authenticate(username, password, (err) => {
      if (err) return res.status(401).json({ error: 'System Authentication Failed' });
      res.json({ username, isRoot: username === 'root' || username === 'admin' });
    }, { serviceName: 'login', remoteHost: 'localhost' });
  });

  const vncProxy = createProxyServer({ target: 'ws://localhost:6080', ws: true });

  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/vnc')) vncProxy.ws(req, socket, head);
  });

  server.listen(port, host, () => {
    console.log(`rTechManager ACTIVE on http://${host}:${port}`);
  });

} catch (e) {
  console.error('FATAL STARTUP ERROR:', e.message);
  console.error('Current Node Version:', process.version);
  console.error('Ensure you have run: npm install express body-parser authenticate-pam http-proxy');
  process.exit(1);
}
