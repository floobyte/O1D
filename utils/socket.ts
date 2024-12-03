import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

// Create a shared socket instance
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Prevent auto-connect until explicitly called
});

// Utility to connect to the server
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connected");
  }
};

// Utility to disconnect from the server
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};
