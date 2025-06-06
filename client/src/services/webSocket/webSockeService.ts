import { io, Socket } from "socket.io-client";

const SOCKET_URL ="https://api.shanusimon.website";

export const AuctionSocket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,
});

export const connectSocket = () => {
  if (!AuctionSocket.connected) {
    console.log("Connecting Socket.IO...");
    AuctionSocket.connect();
  }
};

export const disconnectSocket = () => {
  if (AuctionSocket.connected) {
    console.log("Disconnecting Socket.IO...");
    AuctionSocket.disconnect();
  }
};

AuctionSocket.on("connect", () => {
  console.log("Connected to auction socket server:", AuctionSocket.id);
});

AuctionSocket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

AuctionSocket.on("disconnect", (reason) => {
  console.log("Disconnected from auction socket server:", reason);
});

export default AuctionSocket;
