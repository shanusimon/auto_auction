import { IBidEntity } from "../../models/bid.entity";
import { CreateBidDTO } from "../../../shared/dtos/bid.dto";

export interface IBidRepository{
    create(data:CreateBidDTO):Promise<IBidEntity>
    findHighestBidByCarAndUser(carId:string,userId:string):Promise<IBidEntity | null>
    updateStatus(id:string,status:string):Promise<void>;
    findAllByCarId(carId:string):Promise<IBidEntity[]>
    findByUserId(userId:string):Promise<IBidEntity[]>
    countBidsForSeller(userId:string):Promise<number>
    countBidsForCar(carId:string):Promise<number>
    findTopBidByCarId(carId:string):Promise<IBidEntity | null>
    findById(id:string):Promise<IBidEntity | null>
}