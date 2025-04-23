import { ICarEntity } from "../../models/car.entity";
import { ISellerEntity } from "../../models/seller.entity";

export interface IGetCarDetailsUseCase{
    execute(carId:string):Promise<{car:ICarEntity,seller:ISellerEntity | null}>
}