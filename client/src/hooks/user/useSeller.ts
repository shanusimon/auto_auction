import { useMutation, useQuery } from "@tanstack/react-query";
import { carRegister, getIsSeller, getSellerRequest } from "@/services/user/userServices";
import { AxiosResponse } from "@/services/auth/authServices";
import { SellerRequestPayload } from "@/types/Types";
import { CreateCarDTO } from "@/types/CarFormTypes";

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

export const useCarRegister = ()=>{
return useMutation({
    mutationFn:(carDetails:CreateCarDTO)=>carRegister(carDetails),
    onError:(error:Error)=>{
        console.error("Car Registeration Failed",error)
    }
})
}