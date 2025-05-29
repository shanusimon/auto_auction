import { soldCars } from "@/services/user/userServices";
import { useQuery } from "@tanstack/react-query";

export const useGetSoldCars = ()=>{
    return useQuery({
        queryKey:['sold-cars'],
        queryFn:()=>soldCars(),
        staleTime: 1000 * 60 * 2
    })
}