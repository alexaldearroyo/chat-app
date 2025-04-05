import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { registerChatHandlers } from './sockets/chat';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  registerChatHandlers(io, socket); // Chat logic here
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
