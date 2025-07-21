// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');

const apiRoutes = require('./api');
const { jwtSecret } = require('./config');
const { handleConnection } = require('./services/rtchatService');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRoutes);

const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const { pathname } = url.parse(request.url);

    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', (ws, req) => {
    const token = url.parse(req.url, true).query.token;

    if (!token) {
        console.warn('[WebSocket] Connection attempt without token. Closing.');
        ws.close(1008, 'Token required');
        return;
    }

    try {
        const payload = jwt.verify(token, jwtSecret);
        const { userId } = payload;

        if (!userId) {
            throw new Error('Invalid token payload');
        }

        handleConnection(ws, userId);

    } catch (error) {
        console.error('[WebSocket] Authentication error:', error.message);
        ws.close(1008, 'Invalid token');
    }
});

server.listen(port, () => {
    console.log(`[dotenv] injecting env variables.`);
    console.log(`Server (HTTP & WebSocket) is running on http://localhost:${port}`);
});
