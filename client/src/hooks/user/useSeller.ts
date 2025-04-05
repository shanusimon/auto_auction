import { useMutation, useQuery } from "@tanstack/react-query";
import { getIsSeller, getSellerRequest } from "@/services/user/userServices";
import { AxiosResponse } from "@/services/auth/authServices";
import { SellerRequestPayload } from "@/types/Types";

export const useGetIsSeller = ()=>{
    return useQuery({
        queryKey:['isSeller'],
        queryFn:getIsSeller
    });
}

export const useSellerRequest = ()=>{
    return useMutation<AxiosResponse,Error,SellerRequestPayload>({
        mutationFn:getSellerRequest,
    })
}