const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BUILD_DIR = path.join(__dirname, '.next');
const STATIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    
    // Serve static files from public/
    if (req.url.startsWith('/images/') || req.url.startsWith('/favicon')) {
        const filePath = path.join(STATIC_DIR, req.url);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
            return;
        }
    }
    
    // Serve Next.js static chunks
    if (req.url.startsWith('/_next/')) {
        const relativePath = req.url.replace('/_next/', '');
        const filePath = path.join(BUILD_DIR, 'static', relativePath);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
            fs.createReadStream(filePath).pipe(res);
            return;
        }
    }
    
    // Serve the main page (SSR HTML)
    const htmlPath = path.join(BUILD_DIR, 'server', 'app', 'index.html');
    if (fs.existsSync(htmlPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(htmlPath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Simple server running on port ${PORT}`);
});
