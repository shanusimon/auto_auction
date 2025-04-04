import { useQuery } from "@tanstack/react-query";
import { getIsSeller } from "@/services/user/userServices";


export const useGetIsSeller = ()=>{
    return useQuery({
        queryKey:['isSeller'],
        queryFn:getIsSeller
    });
}