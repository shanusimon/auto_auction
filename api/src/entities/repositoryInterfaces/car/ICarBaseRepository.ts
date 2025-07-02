import { ICarEntity } from "../../models/car.entity";
import { CreateCarDTO } from "../../../shared/dtos/car.dto";

export interface ICarBaseRepository{
    create(data:CreateCarDTO):Promise<ICarEntity>
    findById(carId:string):Promise<ICarEntity | null>
    update(id:string,update:Partial<ICarEntity>):Promise<ICarEntity | null>
     delete(id: string): Promise<boolean>;
       find(
        filter:any,
        skip:number,
        limit:number
    ):Promise<ICarEntity[] | []>
        count(
        filter:any
    ):Promise<number>
}