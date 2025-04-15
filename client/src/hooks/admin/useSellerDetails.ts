import { useQuery } from "@tanstack/react-query";
import { getSellerDetails } from "@/services/admin/adminService";
import { SellerDetailsDTO } from "@/types/AdminTypes";

export const useSellerDetails = (sellerId:string)=>{
    return useQuery<SellerDetailsDTO,Error>({
        queryKey:["sellerDetails",sellerId],
        queryFn:()=>getSellerDetails(sellerId),
        enabled:!!sellerId,
        staleTime:1000 * 60 * 60,
    })
}