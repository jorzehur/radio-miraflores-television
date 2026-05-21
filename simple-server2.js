const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BUILD_DIR = path.join(__dirname, '.next');
const STATIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    const htmlPath = path.join(BUILD_DIR, 'server', 'app', 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (fs.existsSync(htmlPath)) {
        fs.createReadStream(htmlPath).pipe(res);
    } else {
        res.end('OK');
    }
});

server.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
