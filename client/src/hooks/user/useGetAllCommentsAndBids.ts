import { useQuery } from "@tanstack/react-query";
import { getCarComments } from "@/services/user/userServices";


export const useCarCommentsAndBids = (carId:string)=>{
    return useQuery({
        queryKey:["car-comments",carId],
        queryFn:()=>getCarComments(carId),
        enabled:!!carId
    })
}