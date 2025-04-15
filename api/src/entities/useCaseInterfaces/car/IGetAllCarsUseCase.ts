import { PagenateCars } from "../../models/pageinated-users.entity";

export interface IGetAllCarsUseCase{
    execute(page:number,pageSize:number,searchTerm:string):Promise<PagenateCars>
}