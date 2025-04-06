import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { registerChatHandlers } from './sockets/chat';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // NOTE: CORS set to '*' for development purposes only.
  cors: { origin: '*' },
});


io.on('connection', (socket) => {

  // TODO: Implement authentication logic
  // TODO: Implement disconnect logic

  registerChatHandlers(io, socket); // Chat logic here
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
