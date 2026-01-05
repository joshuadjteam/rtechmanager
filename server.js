
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

  console.log(`[rTech] rTechManager v1.3 - Initializing Infrastructure`);

  // --- AUTO-BOOTSTRAP VNC & WEBSOCKIFY ---
  const bootstrapServices = () => {
    try {
      // 1. Start VNC Display :1 if not detected
      const vncCheck = spawnSync('pgrep', ['-f', 'vncserver|Xtightvnc']);
      if (vncCheck.status !== 0) {
        console.log('[rTech] VNC Backend offline. Attempting start...');
        spawn('vncserver', [':1', '-geometry', '1280x720', '-depth', '24'], { detached: true, stdio: 'ignore' }).unref();
      }

      // 2. Start Websockify bridge if not detected
      const wsCheck = spawnSync('pgrep', ['-f', 'websockify']);
      if (wsCheck.status !== 0) {
        console.log('[rTech] Websockify Bridge offline. Attempting start...');
        spawn('websockify', ['--web', '/usr/share/novnc/', '6080', 'localhost:5901'], { detached: true, stdio: 'ignore' }).unref();
      }
    } catch (e) { console.error('[rTech] Service Bootstrap Error:', e.message); }
  };
  bootstrapServices();

  app.use(bodyParser.json());
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) app.use(express.static(distPath));

  // --- API: STATS ---
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

  // --- API: VIRTUAL MACHINES (Virsh) ---
  app.get('/api/system/vms', (req, res) => {
    try {
      // Query virsh for all domains
      const virshOut = execSync('virsh list --all').toString().split('\n');
      const vms = virshOut
        .slice(2) // Skip headers
        .filter(line => line.trim().length > 0)
        .map(line => {
          const parts = line.trim().split(/\s{2,}/);
          return {
            id: parts[0] === '-' ? '' : parts[0],
            name: parts[1],
            state: parts[2]
          };
        });
      res.json(vms);
    } catch (e) {
      // Fallback if virsh is not installed
      res.json([]);
    }
  });

  // --- API: NETWORKING ---
  app.get('/api/system/network', (req, res) => {
    try {
      const netJson = execSync('ip -j addr').toString();
      res.json(JSON.parse(netJson));
    } catch (e) {
      try {
        const netOut = execSync('ip addr show').toString();
        res.json([{ ifname: 'Default', operstate: 'UP', link_type: 'ether' }]);
      } catch(e2) { res.status(500).json({ error: e.message }); }
    }
  });

  // --- API: LOGS ---
  app.get('/api/system/logs', (req, res) => {
    try {
      const logs = execSync('journalctl -n 100 --no-pager').toString().split('\n').filter(l => l.trim());
      res.json(logs);
    } catch (e) { res.json(["Journalctl access failed. Try running with sudo."]); }
  });

  // --- API: INFO ---
  app.get('/api/system/info', (req, res) => {
    try {
      const osName = execSync('cat /etc/os-release | grep PRETTY_NAME').toString().split('=')[1].replace(/"/g, '').trim();
      const cpuModel = execSync('lscpu | grep "Model name"').toString().split(':')[1].trim();
      res.json({
        deviceName: os.hostname(),
        cpuModel,
        os: osName,
        hddModel: "System Partition",
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
      if (err) return res.status(401).json({ error: 'System PAM Rejection' });
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

  server.listen(port, host, () => console.log(`[rTech] Session active on port ${port}`));
} catch (e) { console.error('CRASH:', e); process.exit(1); }
