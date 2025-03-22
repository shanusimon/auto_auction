import { IClient } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";


interface FetchCustomerParams {
    page:number,
    limit:number,
    search:string
}

export type customerResponse = {
    users:IClient[];
    totalPages:number;
    currentPage:number;
}

export const useGetAllCustomersQuery= (
    queryFunc:(params:FetchCustomerParams)=>Promise<customerResponse>,
    page:number,
    limit:number,
    search:string,
)=>{
    return useQuery({
        queryKey:["customers",page,limit,search],
        queryFn:()=>queryFunc({page,limit,search}),
        placeholderData:(prevData) => prevData ? {...prevData} : undefined,
    });
}