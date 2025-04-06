import { Server, Socket } from 'socket.io';
import { ChatMessage, Group, JoinPayload } from '../types';

// TODO: Move group storage to a persistent database in production

const groups: Group[] = [];

export function registerChatHandlers(io: Server, socket: Socket) {
  // Log groups when handler is registered
  console.log("=== CURRENT GROUPS ===");
  console.log(JSON.stringify(groups, null, 2));
  console.log("=====================");

  // Send group list to client when they connect
  console.log(`Sending initial groups list to ${socket.id}. Groups count: ${groups.length}`);
  socket.emit('groupsList', groups);

  // When client requests the groups list
  socket.on('getGroups', () => {
    console.log(`Client ${socket.id} requested groups list. Groups count: ${groups.length}`);
    // Important: Send to ALL clients, not just the requesting one
    io.emit('groupsList', groups);
  });

  // When client creates a new group
  socket.on('createGroup', ({ name, username }: { name: string, username: string }) => {
    // TODO: Prevent duplicate group names
    console.log(`Client ${socket.id} (${username}) is creating group: ${name}`);

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      createdBy: username,
      createdAt: Date.now()
    };

    groups.push(newGroup);
    // TODO: Save newly created group to database
    console.log(`Group created: ${newGroup.id}. Total groups: ${groups.length}`);
    console.log("Updated groups array:", JSON.stringify(groups, null, 2));

    // Notify all clients about the new group
    console.log(`Broadcasting updated groups list to all clients. Connected clients: ${io.sockets.sockets.size}`);

    // Use broadcast to ensure all clients get the update
    io.emit('groupsList', groups);

    // Double-check by sending the update again after a short delay
    setTimeout(() => {
      console.log("Re-sending groups list to ensure delivery");
      io.emit('groupsList', groups);
    }, 1000);

    // Automatically join the creator to the group
    socket.join(newGroup.id);
    socket.data.group = newGroup.id;
    socket.data.username = username;
    console.log(`${username} created and joined group ${name} (${newGroup.id})`);
  });

  // When client joins a group
  socket.on('join', (payload: JoinPayload) => {
    // TODO: Check for duplicate usernames in the same group
    socket.join(payload.group);
    socket.data.group = payload.group;
    socket.data.username = payload.username;
    console.log(`${payload.username} joined group ${payload.group}`);
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
