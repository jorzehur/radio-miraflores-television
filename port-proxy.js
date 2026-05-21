const http = require('http');

const TARGET_PORT = 8080;
const PROXY_PORT = 3000;

const server = http.createServer((clientReq, clientRes) => {
    const options = {
        hostname: '127.0.0.1',
        port: TARGET_PORT,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers,
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true });
    });
    
    proxyReq.on('error', () => {
        clientRes.writeHead(502);
        clientRes.end('Bad Gateway');
    });
    
    clientReq.pipe(proxyReq, { end: true });
});

server.listen(PROXY_PORT, '0.0.0.0', () => {
    console.log('Proxy :' + PROXY_PORT + ' -> :' + TARGET_PORT);
});
