import { createPost } from "@/services/user/userServices";
import { Post } from "@/types/Post.Types";
import { useMutation } from "@tanstack/react-query";


export const useAddPost = ()=>{
    return useMutation({
        mutationFn:(data:Post)=>createPost(data),
        onError:(error:Error)=>{
            console.error("Create post Failed",error);
        }
    })
}