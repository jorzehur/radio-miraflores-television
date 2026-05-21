const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE = '/home/z/my-project';

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.webp': 'image/webp',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm',
    '.map': 'application/json',
    '.rsc': 'text/x-component',
    '.meta': 'application/json',
};

function serveFile(filePath, res) {
    try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath);
            const contentType = MIME[ext] || 'application/octet-stream';
            const data = fs.readFileSync(filePath);
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
            });
            res.end(data);
            return true;
        }
    } catch (e) {
        console.error('Error serving file:', e.message);
    }
    return false;
}

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    console.log(`${new Date().toISOString()} ${req.method} ${urlPath}`);

    // Serve index.html for root
    if (urlPath === '/') {
        const idx = path.join(BASE, '.next', 'server', 'app', 'index.html');
        if (serveFile(idx, res)) return;
        res.writeHead(404);
        res.end('Not Found - index.html missing');
        return;
    }

    // Try multiple locations in order
    const tryPaths = [
        path.join(BASE, 'public', urlPath),
        path.join(BASE, '.next', 'static', urlPath.replace('/_next/static/', '')),
        path.join(BASE, '.next', urlPath),
        path.join(BASE, '.next', 'server', 'app', urlPath),
    ];

    // Handle _next/static paths specifically
    if (urlPath.startsWith('/_next/')) {
        const staticPath = path.join(BASE, '.next', urlPath.replace('/_next/', ''));
        if (serveFile(staticPath, res)) return;
        
        const serverPath = path.join(BASE, '.next', 'server', urlPath.replace('/_next/', ''));
        if (serveFile(serverPath, res)) return;
    }

    for (const fp of tryPaths) {
        if (serveFile(fp, res)) return;
    }

    // SPA fallback - serve index.html for any unmatched route
    const idx = path.join(BASE, '.next', 'server', 'app', 'index.html');
    if (serveFile(idx, res)) return;

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Production server running on http://0.0.0.0:${PORT}`);
    console.log(`Serving from: ${BASE}`);
});

server.on('error', (e) => {
    console.error('Server error:', e.message);
});

// Keep alive
setInterval(() => {
    const used = process.memoryUsage();
    console.log(`Memory: RSS=${Math.round(used.rss/1024/1024)}MB`);
}, 60000);
