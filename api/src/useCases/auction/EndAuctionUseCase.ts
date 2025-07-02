import { IAuctionWonEntity } from "../../entities/models/auction.won.entity";
import { IEndAuctionUseCase } from "../../entities/useCaseInterfaces/auction/IEndAuctionUseCase";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { AuctionWonRepositoryInterface } from "../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IPaymentService } from "../../entities/services/IStripeService";
import { Server as SocketIOServer } from "socket.io";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { NotificationType } from "../../shared/types/notification.Types";
import { messaging } from "../../shared/config";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/bidRepository";
import { ICarBaseRepository } from "../../entities/repositoryInterfaces/car/ICarBaseRepository";

@injectable()
export class EndAuctionUseCase implements IEndAuctionUseCase {
  private io: SocketIOServer | undefined;

  constructor(
    @inject("ISellerRepository") private sellerRepository: ISellerRepository,
    @inject("INotificationRepository") private notificationRepository: INotificationRepository,
    @inject("ICarRepository") private carRepository: ICarRepository,
    @inject("AuctionWonRepositoryInterface") private auctionWonRepository: AuctionWonRepositoryInterface,
    @inject("IPaymentService") private stripeService: IPaymentService,
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("IRedisClient") private redisClient: IRedisClient,
    @inject("IBidRepository") private bidRepository:IBidRepository,
    @inject("ICarBaseRepository") private carBaseRepository:ICarBaseRepository
  ) {}

  public initialize(io: SocketIOServer) {
    this.io = io;
  }

  async execute(carId: string): Promise<IAuctionWonEntity | null> {
    const lockKey = `auction:lock:${carId}`;
    const acquired = await this.redisClient.acquireLock(lockKey, 10000);

    if (!acquired) {
      console.log(`Failed to acquire lock for carId: ${carId}`);
      throw new CustomError("Auction is being processed by another request", HTTP_STATUS.CONFLICT);
    }

    try {
      const now = new Date();

       const car = await this.carRepository.findOneAndUpdate(
        {
          _id: carId,
          approvalStatus: "approved",
          auctionEndTime: { $lte: now },
        },
        [
          {
            $set: {
              approvalStatus: {
                $cond: {
                  if: { 
                    $or: [
                      { $eq: ["$highestBid", 0] },
                      { $lt: ["$highestBid", { $ifNull: ["$reservedPrice", 0] }] }
                    ]
                  },
                  then: "ended",
                  else: "sold",
                },
              },
            },
          },
        ],
        { new: true }
      );

      if (!car) {
        const existingCar = await this.carBaseRepository.findById(carId);
        if (!existingCar) {
          throw new CustomError(ERROR_MESSAGES.CAR_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const existingWon = await this.auctionWonRepository.findByCarId(carId);
        if (existingWon) {
          console.log(`Returning existing auctionWon for carId: ${carId}`);
          return existingWon;
        }
        console.log(`Concurrent endAuction attempt failed for carId: ${carId}`);
        throw new CustomError("Auction already ended or not yet ended", HTTP_STATUS.CONFLICT);
      }

      const existingWon = await this.auctionWonRepository.findByCarId(carId);
      if (existingWon) {
        console.log(`Duplicate auctionWon prevented for carId: ${carId}`);
        return existingWon;
      }

      if (!car.sellerId) {
        throw new CustomError("Car does not have a seller", HTTP_STATUS.BAD_REQUEST);
      }

      const user = await this.sellerRepository.findOne(car.sellerId.toString());
      const carSeller = await this.clientRepository.findById(user?.userId);
      const carWonClient = await this.clientRepository.findById(car.highestBidderId);
      const topBid = await this.bidRepository.findTopBidByCarId(carId);

      if (!topBid || !topBid._id || !topBid.amount || !topBid.userId) {
  throw new CustomError("No valid winning bid found", HTTP_STATUS.BAD_REQUEST);
}

      if (!user || !user._id) {
        throw new CustomError("Seller not found", HTTP_STATUS.NOT_FOUND);
      }

      let auctionWonData: IAuctionWonEntity | null = null;
      const reservePrice = car.reservedPrice ?? null;

      if (reservePrice && car.highestBid < reservePrice) {
        auctionWonData = await this.auctionWonRepository.create({
          carId,
          auctionStatus: "not-sold",
          bidId:topBid._id.toString(),
          amount: car.highestBid,
          winnerId: car.highestBidderId ?? null,
          sellerId:carSeller?.id ?? null,
          platformCharge: 0,
          paymentIntentId:null,
          stripeSessionId:null,
          paymentStatus: "pending",
          createdAt: new Date(),
        });

        await this.notificationRepository.create(
          user._id.toString(),
          NotificationType.AUCTION_RESERVE_NOT_MET,
          `Auction for ${car.title} ended but did not meet the reserve price.`,
          "Auction Reserve Price Not Met"
        );

        if (car.highestBidderId) {
          await this.notificationRepository.create(
            car.highestBidderId.toString(),
            NotificationType.AUCTION_RESERVE_NOT_MET,
            `Your highest bid for "${car.title}" did not meet the seller’s reserve price. The car was not sold.`,
            "Auction Unsuccessful"
          );
        }

        if (carSeller?.fcmToken) {
          const notification = {
            notification: {
              title: "Auction Not Sold",
              body: `Your car "${car.title}" didn't meet the reserve price.`,
            },
            token: carSeller.fcmToken,
          };
          try {
            await messaging.send(notification);
          } catch (error) {
            console.log(`Error in sending notification: ${error}`);
          }
        }

        if (carWonClient?.fcmToken) {
          const notification = {
            notification: {
              title: "Auction Ended – Reserve Not Met",
              body: `Your bid for "${car.title}" was not enough to purchase the car.`,
            },
            token: carWonClient.fcmToken,
          };
          try {
            await messaging.send(notification);
          } catch (error) {
            console.log(`Error in sending notification: ${error}`);
          }
        }

        if (this.io) {
          this.io.to(carId).emit("auction-ended", {
            success: true,
            carId,
            winnerId: car.highestBidderId ?? null,
            amount: car.highestBid ?? 0,
            platformCharge: 0,
            paymentIntentId: "",
            status: "ended",
          });
        }
      } else {
        if (!car.highestBid || !car.highestBidderId) {
          throw new CustomError("No valid highest bidder", HTTP_STATUS.BAD_REQUEST);
        }

        const platformCharge = Math.floor(car.highestBid * 0.05);
      

        auctionWonData = await this.auctionWonRepository.create({
          carId,
          auctionStatus: "sold",
          amount: car.highestBid,
           bidId:topBid._id.toString(),
          winnerId: car.highestBidderId,
          sellerId:carSeller?.id || null,
          platformCharge,
          paymentIntentId:null,
          stripeSessionId:null,
          paymentStatus: "pending",
          createdAt: new Date(),
        });

        await this.notificationRepository.create(
          carSeller?.id ? carSeller.id.toString() : user._id.toString(),
          NotificationType.AUCTION_WIN,
          `Your car "${car.title}" auction has been won for ₹${car.highestBid}. You can check further details in the Seller Dashboard.`,
          "Auction Ended"
        );

        if (carSeller?.fcmToken) {
          const notification = {
            notification: {
              title: "Auction Sold",
              body: `Congratulations! Your car "${car.title}" was sold for ₹${car.highestBid}.`,
            },
            token: carSeller.fcmToken,
          };
          try {
            await messaging.send(notification);
          } catch (error) {
            console.log(`Error sending seller notification: ${error}`);
          }
        }

        await this.notificationRepository.create(
          car.highestBidderId.toString(),
          NotificationType.AUCTION_WIN,
          `Congratulations! You won the auction for "${car.title}" with a bid of ₹${car.highestBid}. Please proceed to the Buyer Dashboard to complete the transaction.`,
          "Auction Won"
        );

        if (carWonClient?.fcmToken) {
          const notification = {
            notification: {
              title: "Auction Won",
              body: `Congratulations! You won the auction for "${car.title}" with a bid of ₹${car.highestBid}. Please proceed to the Buyer Dashboard to complete the transaction.`,
            },
            token: carWonClient.fcmToken,
          };
          try {
            await messaging.send(notification);
          } catch (error) {
            console.log(`Error sending buyer notification: ${error}`);
          }
        }

        if (this.io) {
          this.io.to(carId).emit("auction-ended", {
            success: true,
            carId,
            winnerId: car.highestBidderId,
            amount: car.highestBid,
            platformCharge,
            paymentIntentId: "",
            status: "sold",
          });
        }
      }

      return auctionWonData;
    } finally {
      await this.redisClient.releaseLock(lockKey);
    }
  }
}