import { Server as SocketIOServer } from "socket.io";

export interface IBidController {
  initialize(io: SocketIOServer): void;
  initializeSocketEvents(): void;
}