import { ICarEntity } from "../../models/car.entity";
import { CreateCarDTO, ICarFilter } from "../../../shared/dtos/car.dto";

export interface ICarRepository{
    findByIdAndUpdate(id:string,data:ICarEntity):Promise<void>
    getFilteredCars(filter:ICarFilter,sort:string,page:number,limit:number):Promise<ICarEntity[]>
    findByVehicleNumber(vehicleNumber:string):Promise<ICarEntity | null>
    findCount(sellerId:string):Promise<number>
    findAllCarsBySellerId(sellerId:string):Promise<ICarEntity[]>  
    updateRejectionReason(carId:string,rejectionReason:string):Promise<void>      
    findEndedAuction():Promise<ICarEntity[]>
    findSoldCars():Promise<ICarEntity[]>
  findOneAndUpdate(query: any, update: any, options?: any):Promise<ICarEntity | null>
 auctionAnalytics(): Promise<{ name: string; value: number; count: number }[]>

}