import { ICommunity } from "../../models/community.entity"

export interface ICommunityRepository{
    createCommunity(data:{
        name:string,
        decription:string,
        createdBy:string,
        isActive:boolean
    }):Promise<void>
}








