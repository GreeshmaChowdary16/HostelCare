import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, '') || "http://localhost:5000";

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
