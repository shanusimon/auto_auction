import { getSellerStatistics } from "@/services/user/userServices";
import { useQuery } from "@tanstack/react-query";


export const useGetSellerStatistics = ()=>{
    return useQuery({
        queryKey:['sellerStatistics'],
        queryFn:getSellerStatistics
    });
}