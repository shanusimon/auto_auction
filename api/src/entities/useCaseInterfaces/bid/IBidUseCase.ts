import { ICarEntity } from "../../models/car.entity";

export interface IPlaceBidUseCase{
    execute(amount:number,carId:string,userId:string):Promise<ICarEntity | null>
}