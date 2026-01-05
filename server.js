
const { spawn, spawnSync, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const os = require('os');

try {
  const express = require('express');
  const bodyParser = require('body-parser');
  const pam = require('authenticate-pam');
  const { createProxyServer } = require('http-proxy');
  const WebSocket = require('ws');

  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ noServer: true });
  const port = 1783;
  const host = '0.0.0.0';

  console.log(`[rTech] Operational on Port ${port}`);

  app.use(bodyParser.json());
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) app.use(express.static(distPath));

  // --- COCKPIT: SYSTEM STATS ---
  app.get('/api/system/stats', (req, res) => {
    try {
      const freeOut = execSync('free -b').toString().split('\n')[1].split(/\s+/);
      const ramTotal = parseInt(freeOut[1]) / (1024 ** 3);
      const ramUsed = parseInt(freeOut[2]) / (1024 ** 3);

      const topOut = execSync("top -bn1 | grep 'Cpu(s)'").toString();
      const cpuUsage = 100 - parseFloat(topOut.split(',')[3].split(/id/)[0].trim());

      const dfOut = execSync('df -b /').toString().split('\n')[1].split(/\s+/);
      const hddTotal = parseInt(dfOut[1]) / (1024 ** 3);
      const hddUsed = parseInt(dfOut[2]) / (1024 ** 3);

      res.json({ ramUsed, ramTotal, cpuUsage, hddUsed, hddTotal });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // --- COCKPIT: NETWORKING ---
  app.get('/api/system/network', (req, res) => {
    try {
      const netJson = execSync('ip -j addr').toString();
      res.json(JSON.parse(netJson));
    } catch (e) {
      try { // Fallback if ip -j is not supported
        const netOut = execSync('ip addr show').toString();
        res.json([{ ifname: 'Default', operstate: 'UNKNOWN', address: 'Check logs' }]);
      } catch(e2) { res.status(500).json({ error: e.message }); }
    }
  });

  // --- COCKPIT: LOGS ---
  app.get('/api/system/logs', (req, res) => {
    try {
      const logs = execSync('journalctl -n 100 --no-pager').toString().split('\n').filter(l => l.trim());
      res.json(logs);
    } catch (e) {
      try {
        const logs = execSync('tail -n 100 /var/log/syslog').toString().split('\n').filter(l => l.trim());
        res.json(logs);
      } catch(e2) { res.json(["Error: Could not access journalctl or syslog. Root privileges may be required."]); }
    }
  });

  // --- COCKPIT: HARDWARE INFO ---
  app.get('/api/system/info', (req, res) => {
    try {
      const osName = execSync('cat /etc/os-release | grep PRETTY_NAME').toString().split('=')[1].replace(/"/g, '').trim();
      const cpuModel = execSync('lscpu | grep "Model name"').toString().split(':')[1].trim();
      res.json({
        deviceName: os.hostname(),
        cpuModel,
        os: osName,
        hddModel: "System Drive",
        ram: (os.totalmem() / (1024 ** 3)).toFixed(0) + 'GB'
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/system/users', (req, res) => {
    try {
      const passwd = fs.readFileSync('/etc/passwd', 'utf8').split('\n');
      const users = passwd
        .filter(line => line.length > 0)
        .map(line => {
          const parts = line.split(':');
          return { username: parts[0], uid: parseInt(parts[2]), home: parts[5], shell: parts[6] };
        })
        .filter(u => u.uid === 0 || u.uid >= 1000);
      res.json(users);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/fs/list', (req, res) => {
    const targetPath = req.query.path || '/';
    try {
      const items = fs.readdirSync(targetPath, { withFileTypes: true });
      const result = items.map(item => ({
        name: item.name,
        type: item.isDirectory() ? 'folder' : 'file',
        size: item.isDirectory() ? '--' : (fs.statSync(path.join(targetPath, item.name)).size / 1024).toFixed(1) + ' KB'
      }));
      res.json({ currentPath: targetPath, items: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    pam.authenticate(username, password, (err) => {
      if (err) return res.status(401).json({ error: 'PAM Auth Failed' });
      res.json({ username, isRoot: username === 'root' });
    });
  });

  const vncProxy = createProxyServer({ target: 'ws://localhost:6080', ws: true });
  server.on('upgrade', (req, socket, head) => {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (pathname === '/vnc') {
      vncProxy.ws(req, socket, head);
    } else if (pathname === '/terminal') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        const shell = spawn('bash', ['-i'], { env: { ...process.env, TERM: 'xterm-256color' } });
        shell.stdout.on('data', (d) => ws.send(d.toString()));
        ws.on('message', (m) => shell.stdin.write(m.toString()));
        ws.on('close', () => shell.kill());
      });
    }
  });

  server.listen(port, host);
} catch (e) { console.error(e); process.exit(1); }
