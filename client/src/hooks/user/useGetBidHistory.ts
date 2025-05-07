import { getBidHistory } from "@/services/user/userServices";
import { useQuery } from "@tanstack/react-query";


export const useBidHistory = (carId:string)=>{
return useQuery({
    queryKey:["bidHistoy",{carId}],
    queryFn:()=>getBidHistory(carId)
})
}