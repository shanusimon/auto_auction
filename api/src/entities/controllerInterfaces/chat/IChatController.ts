import { Server as SocketIOServer } from "socket.io";

export interface IChatController {
  initialize(io:SocketIOServer): void;
  initializeSocketEvents(): void;
  
}
