import { PagenateCustomers } from "../../models/pageinated-users.entity";

export interface IGetAllCustomersUseCase {
    execute(pageNumber:number,pageSize:number,searchTerm:string):Promise<PagenateCustomers>
}