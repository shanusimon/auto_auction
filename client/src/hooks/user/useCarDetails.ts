import { useQuery } from "@tanstack/react-query";
import { carDetails } from "@/services/user/userServices";

export const useGetCarDetails = ((carId:string)=>{
    return useQuery({
        queryKey:['carDetails',carId],
        queryFn:()=>carDetails(carId)
    })
})