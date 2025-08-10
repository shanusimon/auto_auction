import { IGetSellerStatisticsUseCase } from "../../entities/useCaseInterfaces/seller/ISellerStatistics";
import { inject, injectable } from "tsyringe";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/IBidRepository";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { SellerStatistics } from "../../entities/useCaseInterfaces/seller/ISellerStatistics";

@injectable()
export class GetSellerStatistics implements IGetSellerStatisticsUseCase {
  constructor(
    @inject("ICarRepository") private _carRepository: ICarRepository,
    @inject("ISellerRepository") private _sellerRepository: ISellerRepository,
    @inject("IBidRepository") private _bidRepository: IBidRepository,
  ) {}
  
  async execute(id: string): Promise<SellerStatistics> {
    const seller = await this._sellerRepository.findByUserId(id);
    if(!seller || !seller._id){
      throw new CustomError(
        ERROR_MESSAGES.SELLER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const sellerId = seller?._id?.toString();

    const totalListing = await this._carRepository.findCount(sellerId);
      const cars = await this._carRepository.findAllCarsBySellerId(sellerId);

    const pendingAuction = [];
    const soldCar = [];
    const rejectedCar = [];
    const activeAuction = [];

    const now = new Date().getTime();

    for (let val of cars) {
        switch (val.approvalStatus) {
          case "pending":
            pendingAuction.push(val);
            break;
          case "sold":
            soldCar.push(val);
            break;
          case "rejected":
            rejectedCar.push(val);
            break;
        }
      
        const auctionEnd = new Date(String(val.auctionEndTime)).getTime();
        if (now < auctionEnd && val.approvalStatus === "approved") {
          activeAuction.push(val);
        }
      }

      const activeAuctionwithBidCounts = await Promise.all(
        activeAuction.map(async (car) => {
      
          const bidCount = await this._bidRepository.countBidsForCar(car._id?.toString() || "");

          return {
            ...((car as unknown as any)),
            bidCount,
          };
        }),
      )
    const enrichedSoldCars = await Promise.all(
    soldCar.map(async (car) => {
      const bidCount = await this._bidRepository.countBidsForCar(car._id?.toString() || "");
      return { ...(car as any), bidCount };
    })
  );
      
    const totalBids = await this._bidRepository.countBidsForSeller(sellerId);
    

    return {
      totalListing,
      pendingAuction,
      soldCar:enrichedSoldCars,
      rejectedCar,
      activeAuction:activeAuctionwithBidCounts,
      totalBids
    };
  }
}