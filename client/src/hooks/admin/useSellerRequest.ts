import { ISellerEntity } from "@/types/AdminTypes";
import { FetchCustomerParams } from "@/types/AdminTypes";
import { useQuery } from "@tanstack/react-query";

export type sellerResponse = {
    sellers:ISellerEntity[];
    totalPage:number,
    currentPage:number
}

export type seller = {
    sellers:ISellerEntity[];
    totalPage:number,
    currentPage:number
}
export const useGetAllSellerRequestsQuery = (
    queryfunc:(params:FetchCustomerParams)=>Promise<sellerResponse>,
    page:number,
    limit:number,
    search:string,
)=>{
    return useQuery({
        queryKey:["sellerRequest",page,limit,search],
        queryFn:()=>queryfunc({page,limit,search}),
        placeholderData:(prevDate)=>prevDate ? {...prevDate} : undefined
    });
}

export const useSellers = (
    queryfunc:(params:FetchCustomerParams)=>Promise<seller>,
    page:number,
    limit:number,
    search:string
)=>{
    return useQuery({
        queryKey:["sellers",page,limit,search],
        queryFn:()=>queryfunc({page,limit,search}),
        placeholderData:(prevDate)=>prevDate ? {...prevDate} : undefined
    })
}