import { IBidEntity } from "../../models/bid.entity";

export interface IGetBidHistoryUseCase{
    execute(carId:string):Promise<IBidEntity[]>
}