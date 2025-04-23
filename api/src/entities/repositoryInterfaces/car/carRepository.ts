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
} 