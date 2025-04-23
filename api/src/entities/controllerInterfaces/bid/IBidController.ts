import { Server } from "socket.io";

export interface IBidSocketController{
    setupSocketEvents(io:Server):void;
}