import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { registerChatHandlers } from './sockets/chat';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Log number of connected clients every 5 seconds
setInterval(() => {
  const connectedClients = io.sockets.sockets.size;
  console.log(`Connected clients: ${connectedClients}`);
}, 5000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  console.log(`Total clients connected: ${io.sockets.sockets.size}`);

  socket.on('disconnect', () => {
    // TODO: Clean up user session or notify group members (optional enhancement)
    // TODO: Implement disconnect on the frontend
    console.log('Client disconnected:', socket.id);
    console.log(`Total clients connected: ${io.sockets.sockets.size}`);
  });

  registerChatHandlers(io, socket); // Chat logic here
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
