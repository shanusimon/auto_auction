import { ICarEntity } from "../../models/car.entity";

export interface SellerStatistics {
  totalListing: number;
  pendingAuction: ICarEntity[];
  soldCar: (ICarEntity & { bidCount: number })[];
  rejectedCar: ICarEntity[];
  activeAuction: (ICarEntity & { bidCount: number })[];
  totalBids: number;
}

export interface IGetSellerStatisticsUseCase {
    execute(id:string):Promise<SellerStatistics>
}