import { getAllBids } from "@/services/user/userServices";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBids = ()=>{
    return useQuery({
        queryKey:['allBids'],
        queryFn:getAllBids,
        staleTime: 1000 * 60
    })
}
