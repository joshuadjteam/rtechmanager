
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
app.use(express.static(path.join(__dirname, 'dist')));

// REAL LINUX AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // PAM auth checks the actual Linux system accounts
  pam.authenticate(username, password, (err) => {
    if (err) {
      console.log(`Auth failed for user: ${username}`);
      return res.status(401).json({ error: 'Invalid system credentials' });
    }
    console.log(`User ${username} authenticated successfully`);
    res.json({ 
      username, 
      isRoot: username === 'root',
      token: 'system-session-' + Date.now() 
    });
  }, { serviceName: 'login', remoteHost: 'localhost' });
});

// VNC PROXY (Websockify logic)
// Forwards /vnc websocket requests to local TightVNC port 5900
const proxy = createProxyServer({
  target: 'ws://localhost:5900',
  ws: true
});

server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/vnc')) {
    proxy.ws(req, socket, head);
  }
});

server.listen(port, () => {
  console.log(`rTechManager backend active on http://localhost:${port}`);
});
