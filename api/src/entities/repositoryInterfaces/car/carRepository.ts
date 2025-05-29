import { ICarEntity } from "../../models/car.entity";
import { CreateCarDTO, ICarFilter } from "../../../shared/dtos/car.dto";

export interface ICarRepository{
    create(data:CreateCarDTO):Promise<ICarEntity>
    find(
        filter:any,
        skip:number,
        limit:number
    ):Promise<ICarEntity[] | []>
    count(
        filter:any
    ):Promise<number>
    findById(carId:string):Promise<ICarEntity | null>
    findByIdAndUpdate(id:string,data:ICarEntity):Promise<void>
    getFilteredCars(filter:ICarFilter,sort:string,page:number,limit:number):Promise<ICarEntity[]>
    update(id:string,updateDate:Partial<ICarEntity>):Promise<ICarEntity | null>
    findByVehicleNumber(vehicleNumber:string):Promise<ICarEntity | null>
    findCount(sellerId:string):Promise<number>
    findAllCarsBySellerId(sellerId:string):Promise<ICarEntity[]>  
    updateRejectionReason(carId:string,rejectionReason:string):Promise<void>      
    findEndedAuction():Promise<ICarEntity[]>
    findSoldCars():Promise<ICarEntity[]>
  findOneAndUpdate(query: any, update: any, options?: any):Promise<ICarEntity | null>
 auctionAnalytics(): Promise<{ name: string; value: number; count: number }[]>

}