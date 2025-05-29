import { wonAuction } from "@/services/user/userServices";
import { useQuery } from "@tanstack/react-query";


export const useWonAuction = ()=>{
    return useQuery({
        queryKey:['auction-won'],
        queryFn:()=>wonAuction(),
    })
}