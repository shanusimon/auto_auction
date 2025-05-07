
import { Server as SocketIOServer, Socket } from "socket.io";
import { IBidController } from "../../../entities/controllerInterfaces/bid/IBidController";
import { inject, injectable } from "tsyringe";
import { bidSchema } from "../../../shared/validation/bid.validation";
import { ERROR_MESSAGES } from "../../../shared/constants";
import { IPlaceBidUseCase } from "../../../entities/useCaseInterfaces/bid/IBidUseCase";

@injectable()
export class BidController implements IBidController {
  private io?: SocketIOServer;

  constructor(
    @inject("IPlaceBidUseCase") private placeBidUsecase: IPlaceBidUseCase
  ) {}

  // Initialize with the Socket.IO server instance
  public initialize(io: SocketIOServer): void {
    this.io = io;
    this.initializeSocketEvents();
  }

  public initializeSocketEvents(): void {
    if (!this.io) {
      throw new Error("Socket.IO server not initialized");
    }
    
    this.io.on("connection", (socket: Socket) => {
      console.log("User Connected:", socket.id);

      // Join an auction room
      socket.on("join-auction", (data: { carId: string }) => {
        const { carId } = data;
        socket.join(carId);
        console.log(`Socket ${socket.id} joined auction room ${carId}`);
        socket.emit("joined-auction", { success: true, carId });
      });

      // Handle incoming bids
      socket.on(
        "place-bid",
        async (payload: { carId: string; amount: number; userId: string }) => {
          console.log("Place-bid event received:", payload);
          const result = bidSchema.safeParse(payload);

          if (!result.success) {
            socket.emit("bid-placed", {
              success: false,
              message: ERROR_MESSAGES.INVALID_BID_PAYLOAD,
            });
            return;
          }

          try {
            const updatedCar = await this.placeBidUsecase.execute(
              payload.amount,
              payload.carId,
              payload.userId
            );

            // Broadcast new bid to the auction room
            this.io!.to(payload.carId).emit("new-bid", {
              success: true,
              bid: {
                userId: payload.userId,
                amount: payload.amount,
                carId: payload.carId,
                auctionEndTime: updatedCar ? updatedCar.auctionEndTime : null,
              },
            });

            // Send acknowledgment to the bidder
            socket.emit("bid-placed", {
              success: true,
              message: "Bid placed successfully",
            });
          } catch (error: any) {
            // Send error to the bidder only
            socket.emit("bid-placed", {
              success: false,
              message: error.message || "Failed to place bid",
            });
          }
        }
      );
  }
  )}
}