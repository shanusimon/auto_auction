import { ICarEntity } from "../../models/car.entity";

export interface IGetSoldCarsUseCase{
    execute():Promise<ICarEntity[] | []>
}