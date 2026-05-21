const http = require('http');
const fs = require('fs');
const path = require('path');
const BASE = '/home/z/my-project';
const MIME = {
    '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webp': 'image/webp',
    '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    
    const tryPaths = [
        path.join(BASE, 'public', urlPath),
        path.join(BASE, '.next', urlPath),
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
    
    // SPA fallback
    const idx = path.join(BASE, '.next', 'server', 'app', 'index.html');
    try {
        const data = fs.readFileSync(idx);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    } catch(e) {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(8080, '0.0.0.0', () => console.log('Server on :8080'));
