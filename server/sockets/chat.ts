import { Server, Socket } from 'socket.io';
import { ChatMessage, JoinPayload } from '../types';

export function registerChatHandlers(io: Server, socket: Socket) {
  // When client joins a group
  socket.on('join', (payload: JoinPayload) => {
    socket.join(payload.group);
    socket.data.group = payload.group;
    socket.data.username = payload.username;
    console.log(`${payload.username} joined group ${payload.group}`);
  });

  // When client sends a message
  socket.on('message', (msg: ChatMessage) => {
    const group = socket.data.group;
    if (!group || msg.content.length > 200) {
      return; // Invalid state or too long
    }
    io.to(group).emit('message', {
      username: socket.data.username,
      content: msg.content,
      timestamp: Date.now(),
    });
  });

  // TODO: handle disconnect, name conflict, history, etc.
}
