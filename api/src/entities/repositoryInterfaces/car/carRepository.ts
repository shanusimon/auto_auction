import { ICarEntity } from "../../models/car.entity";
import { CreateCarDTO } from "../../../shared/dtos/car.dto";

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
}