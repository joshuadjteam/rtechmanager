
const express = require('express');
const bodyParser = require('body-parser');
const pam = require('authenticate-pam');
const http = require('http');
const { createProxyServer } = require('http-proxy');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = 1783;

app.use(bodyParser.json());

// Serve the frontend build
// Note: In a real deployment, you'd run 'npm run build' first
app.use(express.static(path.join(__dirname, 'dist')));

// SYSTEM ACCOUNT AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Credentials required' });
  }

  // PAM.authenticate checks the /etc/passwd and /etc/shadow files
  pam.authenticate(username, password, (err) => {
    if (err) {
      console.error(`FAILED: Auth attempt for user [${username}]`);
      return res.status(401).json({ error: 'Invalid system credentials' });
    }
    
    console.log(`SUCCESS: User [${username}] authorized via PAM`);
    res.json({ 
      username, 
      isRoot: username === 'root',
      node: process.version,
      platform: process.platform
    });
  }, { serviceName: 'login', remoteHost: 'localhost' });
});

// VNC WEBSOCKET PROXY
// Maps browser websockets on port 1783/vnc to local VNC on 5901
const proxy = createProxyServer({
  target: 'ws://localhost:5901',
  ws: true
});

server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/vnc')) {
    proxy.ws(req, socket, head);
  }
});

server.listen(port, () => {
  console.log(`rTechManager ACTIVE: http://localhost:${port}`);
});
