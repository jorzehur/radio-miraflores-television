const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const MIME = {
    '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    
    const tryPaths = [
        path.join(BASE, 'public', urlPath),
        path.join(BASE, '.next', urlPath),
        path.join(BASE, '.next', 'static', urlPath.replace('/_next/', '')),
    ];
    
    for (const fp of tryPaths) {
        try {
            if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
                res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
                fs.createReadStream(fp).pipe(res);
                return;
            }
        } catch(e) {}
    }
    
    const idx = path.join(BASE, '.next', 'server', 'app', 'index.html');
    try {
        if (fs.existsSync(idx)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(idx).pipe(res);
            return;
        }
    } catch(e) {}
    
    res.writeHead(404);
    res.end('Not Found');
});

server.listen(3000, '0.0.0.0', () => console.log('OK :3000'));
