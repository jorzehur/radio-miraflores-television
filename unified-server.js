const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
};

function serveStatic(req, res) {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    
    const tryPaths = [
        path.join(BASE, 'public', urlPath),
        path.join(BASE, '.next', urlPath),
        path.join(BASE, '.next', 'static', urlPath.replace('/_next/', '')),
    ];
    
    for (const filePath of tryPaths) {
        try {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                res.writeHead(200, {
                    'Content-Type': MIME[ext] || 'application/octet-stream',
                    'Cache-Control': 'public, max-age=3600',
                });
                fs.createReadStream(filePath).pipe(res);
                return true;
            }
        } catch(e) {}
    }
    
    // SPA fallback
    const indexPath = path.join(BASE, '.next', 'server', 'app', 'index.html');
    try {
        if (fs.existsSync(indexPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(indexPath).pipe(res);
            return true;
        }
    } catch(e) {}
    
    return false;
}

// Listen on both port 3000 (for Caddy) and 8080 (backup)
const handler = (req, res) => {
    if (!serveStatic(req, res)) {
        res.writeHead(404);
        res.end('Not Found');
    }
};

const server3000 = http.createServer(handler);
const server8080 = http.createServer(handler);

server3000.listen(3000, '0.0.0.0', () => {
    console.log('Server on :3000');
});

server8080.listen(8080, '0.0.0.0', () => {
    console.log('Server on :8080');
});
