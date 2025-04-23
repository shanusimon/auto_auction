// import { inject, injectable } from "tsyringe";
// import { Server, Socket } from "socket.io";
// import { IBidSocketController } from "../../../entities/controllerInterfaces/bid/IBidController";
// import { CustomError } from "../../../entities/utils/custom.error";
// import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
// import { IPlaceBidUseCase } from "../../../entities/useCaseInterfaces/bid/IBidUseCase";

// @injectable()
// export class BidController implements IBidSocketController {
//   constructor(
//     @inject("IPlaceBidUseCase") private placebidusecase: IPlaceBidUseCase
//   ) {}

//   setupSocketEvents(io: Server): void {
//     const auctionNamespace = io.of('/auction');
    
//     auctionNamespace.on('connection', (socket: Socket) => {
//       console.log(`Client connected to auction namespace: ${socket.id}`);
      
//       // Join car auction room
//       socket.on('join-auction', (carId: string) => {
//         socket.join(`car-auction-${carId}`);
//         console.log(`Client ${socket.id} joined car auction: ${carId}`);
        
//         // Emit to client that they've joined successfully
//         socket.emit('joined-auction', { 
//           success: true, 
//           carId 
//         });
//       });
      
//       // Leave car auction room
//       socket.on('leave-auction', (carId: string) => {
//         socket.leave(`car-auction-${carId}`);
//         console.log(`Client ${socket.id} left car auction: ${carId}`);
//       });
      
//       // Place bid on a car
//       socket.on('place-bid', async (data: { carId: string, amount: number, userId: string }) => {
//         try {
//           const { carId, amount, userId } = data;
          
//           // Process bid through car use case layer
//           const bidResult = await this.placebidusecase.execute(
//             amount,
//             carId,
//             userId
//           );
          
//           // Notify everyone in the car auction room about the new bid
//           auctionNamespace.to(`car-auction-${carId}`).emit('new-bid', {
//             success: true,
//             bid: bidResult
//           });
          
//           // Acknowledge successful bid to the sender
//           socket.emit('bid-placed', {
//             success: true,
//             message: 'Bid placed successfully',
//             bidData: bidResult
//           });
          
//         } catch (error) {
//           console.error('Error placing bid:', error);
          
//           // Send error to client
//           socket.emit('bid-error', {
//             success: false,
//             message: error instanceof CustomError 
//               ? error.message 
//               : ERROR_MESSAGES.SERVER_ERROR
//           });
//         }
//       });
      
//       // Get current car auction state
//       socket.on('get-auction-state', async (carId: string) => {
//         try {
//           const carAuctionState = await this.carUseCase.getCarWithBids(carId);
          
//           socket.emit('auction-state', {
//             success: true,
//             carId,
//             state: carAuctionState
//           });
          
//         } catch (error) {
//           socket.emit('auction-state-error', {
//             success: false,
//             message: error instanceof CustomError 
//               ? error.message 
//               : ERROR_MESSAGES.SERVER_ERROR
//           });
//         }
//       });
      
//       // Get list of active car auctions
//       socket.on('get-active-auctions', async () => {
//         try {
//           const activeAuctions = await this.carUseCase.getActiveAuctions();
          
//           socket.emit('active-auctions', {
//             success: true,
//             auctions: activeAuctions
//           });
          
//         } catch (error) {
//           socket.emit('active-auctions-error', {
//             success: false,
//             message: error instanceof CustomError 
//               ? error.message 
//               : ERROR_MESSAGES.SERVER_ERROR
//           });
//         }
//       });
      
//       // Handle disconnection
//       socket.on('disconnect', () => {
//         console.log(`Client disconnected from auction: ${socket.id}`);
//       });
//     });
//   }
// }