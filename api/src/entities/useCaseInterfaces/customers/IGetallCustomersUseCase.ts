import { PagenateCustomers } from "../../models/pageinated-customer.entity";

export interface IGetAllCustomersUseCase {
    execute(pageNumber:number,pageSize:number,searchTerm:string):Promise<PagenateCustomers>
}