import { PagenateSellers } from "../../models/pageinated-users.entity";

export interface IGetAllSellerRequestUseCase {
    execute(page:number,pageSize:number,searchTerm:string,isRequestTable:boolean):Promise<PagenateSellers>
}