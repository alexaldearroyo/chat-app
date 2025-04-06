import io from "socket.io-client";
import type { Group } from '../../../shared/types';

export const socket = io("http://localhost:3000");

// Handle connection
socket.on("connect", () => {
  // Connection established
});

// Handle updated group list
socket.on("groupsList", (groups: Group[]) => {
  // TODO: Use this in a global store or UI component if needed
});

// Handle connection error
socket.on("connect_error", (error: Error) => {
  // TODO: Show user-friendly error message if desired
});

// Handle disconnect
socket.on("disconnect", (reason: string) => {
  // TODO: Handle disconnect scenario
});
