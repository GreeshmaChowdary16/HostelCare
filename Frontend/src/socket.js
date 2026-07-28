import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

socket.on("connect", () => {
  console.log("[Socket.io Frontend] Connected to backend real-time server!");
});

socket.on("disconnect", () => {
  console.log("[Socket.io Frontend] Disconnected from backend server");
});

export default socket;
