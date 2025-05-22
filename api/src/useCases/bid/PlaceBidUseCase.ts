import { IPlaceBidUseCase } from "../../entities/useCaseInterfaces/bid/IBidUseCase";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/bidRepository";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/carRepository";
import { ERROR_MESSAGES } from "../../shared/constants";
import { ICarEntity } from "../../entities/models/car.entity";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { NotificationType } from "../../shared/types/notification.Types";

@injectable()
export class PlaceBidUseCase implements IPlaceBidUseCase {
  constructor(
    @inject("IWalletRepository") private walletRepository: IWalletRepository,
    @inject("IBidRepository") private bidRepository: IBidRepository,
    @inject("IWalletTransactionRepository")
    private walletTransactionRepository: IWalletTransactionRepository,
    @inject("ICarRepository") private carRepository: ICarRepository,
    @inject("ISellerRepository") private sellerRepository:ISellerRepository,
    @inject("INotificationRepository") private notificationRepository:INotificationRepository
  ) {}

  async execute(
    amount: number,
    carId: string,
    userId: string
  ): Promise<ICarEntity> {
    const car = await this.carRepository.findById(carId);
    if (!car) {
      throw new Error(ERROR_MESSAGES.CAR_NOT_FOUND);
    }

    const now = new Date();
    if (car.auctionEndTime && new Date(car.auctionEndTime) < now) {
      throw new Error("Auction has already ended");
    }

    const seller = await this.sellerRepository.findByUserId(userId);
    console.log("is this same",seller?._id,car.sellerId);
    if(car.sellerId.toString() === seller?._id?.toString()){
      throw new Error("You cannot place a bid on a car that you have listed.");
    }

    if (car.highestBid >= amount) {
      throw new Error(ERROR_MESSAGES.BID_AMOUNT_ERROR);
    }

    if (car.highestBidderId && car.highestBidderId.toString() === userId) {
      throw new Error("User cannot bid twice without being outbid");
    }

    const wallet = await this.walletRepository.findWalletByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const depositAmount = amount * (10 / 100); 

    if (wallet.availableBalance < depositAmount) {
      throw new Error("Insufficient balance for bidding");
    }

    // Deduct deposit from user's wallet
    wallet.availableBalance -= depositAmount;
    wallet.reservedBalance += depositAmount;

    await this.walletRepository.update(wallet._id, {
      availableBalance: wallet.availableBalance,
      reservedBalance: wallet.reservedBalance,
    });

    await this.walletTransactionRepository.create({
      walletId: wallet._id,
      type: "bid",
      amount: depositAmount,
      status: "completed",
    });

    const newBid = await this.bidRepository.create({
      carId,
      userId,
      amount,
      depositHeld: depositAmount,
      status: "active",
    });

    // Refund previous highest bidder if exists
    if (car.highestBidderId) {
      const previousBid = await this.bidRepository.findHighestBidByCarAndUser(
        carId,
        car.highestBidderId.toString()
      );

      if (previousBid && previousBid._id) {
        await this.bidRepository.updateStatus(
          previousBid._id.toString(),
          "outbid"
        );

        const previousWallet = await this.walletRepository.findWalletByUserId(
          car.highestBidderId.toString()
        );

        if (previousWallet) {
          previousWallet.availableBalance += previousBid.depositHeld;
          previousWallet.reservedBalance -= previousBid.depositHeld;

          await this.walletRepository.update(previousWallet._id, {
            availableBalance: previousWallet.availableBalance,
            reservedBalance: previousWallet.reservedBalance,
          });

          await this.walletTransactionRepository.create({
            walletId: previousWallet._id,
            type: "outbid",
            amount: previousBid.depositHeld,
            status: "completed",
          });

          await this.notificationRepository.create(
            userId,
            NotificationType.BID_OUTBID,
            `Your Bid On Car ${car.title} Has Been OutBid By ${amount}`,
            "OutBid"
          );

        }
      }
    }

    // Update car with new highest bid
    const updateData: any = {
      highestBid: amount,
      highestBidderId: userId,
    };

    if (car.auctionEndTime) {
      const timeRemaining =
        (car.auctionEndTime.getTime() - now.getTime()) / 1000; // in seconds

      if (timeRemaining <= 60) {
        const newEndTime = new Date(
          car.auctionEndTime.getTime() + 2 * 60 * 1000
        ); // +2 minutes
        updateData.auctionEndTime = newEndTime;
      }
    }
    const updatedCar = await this.carRepository.update(carId, updateData);
    if (!updatedCar) {
      throw new Error("failed to update car")
    }
    return updatedCar
  }
}
