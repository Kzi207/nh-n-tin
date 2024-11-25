const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Tạo server HTTP để phục vụ file tĩnh
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(data);
        }
    });
});

// Hàm xác định Content-Type
const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const map = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };
    return map[ext] || 'application/octet-stream';
};

// Tạo WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const text = message.toString(); // Chuyển dữ liệu sang chuỗi
        console.log(`Received: ${text}`);

        // Phát tin nhắn đến tất cả các client
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text); // Gửi tin nhắn dưới dạng chuỗi
            }
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});

// Lắng nghe trên cổng 3000
server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
