import { IBidEntity } from "../../models/bid.entity";

export interface IGetAllBidsUseCase{
    execute(userId:string):Promise<IBidEntity[] | []>
}