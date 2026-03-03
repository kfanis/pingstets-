const http = require('http');

let connections = [];
let totalRequests = 0;

const server = http.createServer((req, res) => {
    // Разрешаем CORS, чтобы фронтенд мог брать данные
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/stats') {
        // Отдаем статистику для фронтенда
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            total: totalRequests,
            activeNow: connections.length,
            recentIps: [...new Set(connections.slice(-10))] // Последние 10 уникальных IP
        }));
        return;
    }

    // Логируем каждый входящий "хит"
    totalRequests++;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    connections.push(ip);
    if (connections.length > 100) connections.shift(); // Храним только последние 100

    res.writeHead(200);
    res.end("Logged");
});

server.listen(3000, () => {
    console.log('Бэкенд запущен на порту 3000');
});
