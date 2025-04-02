import { userAxiosInstance } from "@/api/clientAxios";
import { ChangePasswordData } from "@/hooks/user/userDashboard";
import { WalletTransactionsResponse } from "@/types/Types";

export const logoutUser = async()=>{
    const response = await userAxiosInstance.post("/_us/user/logout");
    return response.data
}

export const changePassword = async(data:ChangePasswordData)=>{
    const response = await userAxiosInstance.patch("/_us/user/change-password",data);
    console.log("changePassword response",response)
    return response.data
}

export const getAllTransaction = async (page: number = 1, limit: number = 6): Promise<WalletTransactionsResponse> => {
    const response = await userAxiosInstance.get("/_us/user/getAllTransaction", {  
        params: { page, limit },
    });
    return response.data.data;
};

export const getWalletBalance = async()=>{
    const response = await userAxiosInstance.get("/_us/user/getWalletBalance");
    return response.data
}