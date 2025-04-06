import { Server, Socket } from 'socket.io';
import { ChatMessage, Group, JoinPayload } from '../../shared/types';

// TODO: Move group storage to a persistent database in production

const groups: Group[] = [];

export function registerChatHandlers(io: Server, socket: Socket) {

  // Send group list to client when they connect
  socket.emit('groupsList', groups);

  // When client requests the groups list
  socket.on('getGroups', () => {
    // Send to all clients
    io.emit('groupsList', groups);
  });

  // When client creates a new group
  socket.on('createGroup', ({ name, username }: { name: string, username: string }) => {
    // TODO: Prevent duplicate group names

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      createdBy: username,
      createdAt: Date.now()
    };

    groups.push(newGroup);
    // TODO: Save newly created group to database

    // Use broadcast to ensure all clients get the update
    io.emit('groupsList', groups);

    // Double-check by sending the update again after a short delay
    setTimeout(() => {
      io.emit('groupsList', groups);
    }, 1000);

    // Automatically join the creator to the group
    socket.join(newGroup.id);
    socket.data.group = newGroup.id;
    socket.data.username = username;
  });

  // When client joins a group
  socket.on('join', (payload: JoinPayload) => {
    // TODO: Check for duplicate usernames in the same group
    socket.join(payload.group);
    socket.data.group = payload.group;
    socket.data.username = payload.username;
  });

  // When client sends a message
  socket.on('message', (msg: ChatMessage) => {
     // TODO: Store messages in history per group
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

  // TODO: Implement group deletion feature (requires auth + DB check)
}
