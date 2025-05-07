import { userAxiosInstance } from "@/api/clientAxios";

export const getConversation = async(sellerId:string)=>{
    const response = await userAxiosInstance.post("/_us/user/conversation",{sellerId});
    return response.data
}