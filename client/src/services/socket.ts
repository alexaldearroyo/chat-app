import io from "socket.io-client";
import type { Group } from "./types";

export const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

// Add debug logs for group events
socket.on("groupsList", (groups: Group[]) => {
  console.log("Received groups list:", groups);
});

socket.on("connect_error", (error: Error) => {
  console.error("Connection error:", error);
});

socket.on("disconnect", (reason: string) => {
  console.log("Disconnected:", reason);
});
