import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerChatHandlers } from '../sockets/chat';
import type { Server, Socket } from 'socket.io';
import type { ChatMessage } from '../types';

const createMockSocket = () => {
  const onMap: Record<string, Function> = {};

  const socket: Partial<Socket> = {
    data: {},
    on: vi.fn((event, handler) => {
      onMap[event] = handler;
    }),
    join: vi.fn(),
  };

  return { socket: socket as Socket, onMap };
};

const createMockIO = () => {
  return {
    to: vi.fn().mockReturnThis(),
    emit: vi.fn()
  } as unknown as Server;
};

describe('registerChatHandlers', () => {
  let socket: Socket;
  let onMap: Record<string, Function>;
  let io: Server;

  beforeEach(() => {
    ({ socket, onMap } = createMockSocket());
    io = createMockIO();
    registerChatHandlers(io, socket);
  });

  it('should join a group and store username/group in socket.data', () => {
    onMap['join']({ username: 'Alex', group: 'group1' });

    expect(socket.join).toHaveBeenCalledWith('group1');
    expect(socket.data.group).toBe('group1');
    expect(socket.data.username).toBe('Alex');
  });

  it('should not emit message if message is too long', () => {
    socket.data.group = 'group1';
    socket.data.username = 'Alex';

    onMap['message']({
      content: 'x'.repeat(201),
    } as ChatMessage);

    expect(io.to).not.toHaveBeenCalled();
  });

  it('should emit message to correct group if valid', () => {
    socket.data.group = 'group1';
    socket.data.username = 'Alex';

    onMap['message']({
      content: 'Hello!',
    });

    expect(io.to).toHaveBeenCalledWith('group1');
    expect(io.to('group1').emit).toHaveBeenCalledWith('message', expect.objectContaining({
      username: 'Alex',
      content: 'Hello!',
    }));
  });
});
