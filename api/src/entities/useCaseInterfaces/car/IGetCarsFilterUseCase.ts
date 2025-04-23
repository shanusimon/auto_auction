import { ICarEntity } from "../../models/car.entity";
import { ICarFilter } from "../../../shared/dtos/car.dto";

export interface IGetCarsFilterUseCase{
    execute(filter:ICarFilter,page:number,limit:number):Promise<ICarEntity[]>;
}