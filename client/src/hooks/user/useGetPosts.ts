import { getAllposts } from "@/services/user/userServices";
import { useQuery } from "@tanstack/react-query";

export const useGetPosts = ()=>{
    return useQuery({
        queryKey:["allPosts"],
        queryFn:getAllposts,
        staleTime:1000 * 60
    })
}