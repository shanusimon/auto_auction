import { useMutation } from "@tanstack/react-query";
import { carComment } from "@/services/user/userServices";

export const useAddCarComment = ()=>{
    return useMutation({
        mutationFn:carComment
    })
}
