import { ICarEntity } from "./car.entity";
import { IClientEntity } from "./client.entity";
import { ISellerEntity } from "./seller.entity";

export interface PagenateCustomers {
    users:IClientEntity[] | [],
    total:number
}

export interface PagenateSellers {
    sellers:ISellerEntity[] | []
    total:number
}

export interface PagenateCars{
    cars:ICarEntity[] | []
    total:number
}