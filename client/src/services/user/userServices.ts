import { userAxiosInstance } from "@/api/clientAxios";

export const logoutUser = async()=>{
    const response = await userAxiosInstance.post("/_us/user/logout");
    return response.data
}
