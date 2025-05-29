import { userAxiosInstance } from "@/api/clientAxios";

export interface AddMoneyData{
    amount:number
}

export const addMoneyToWallet = async(data:AddMoneyData)=>{
    try {
        const response = await userAxiosInstance.post("/_pmt/user/add-money",data);
        return response.data
    } catch (error:any) {
        throw error.response?.data || "add mponey to wallet failed "
    }
}

export const createCheckOut = async (auctionId:string)=>{
  const response = await userAxiosInstance.post(`/_pmt/user/createSession/${auctionId}`);
  return response.data
}

export const verify_payment =async(sessionId:string)=>{
    const resposne = await userAxiosInstance.post(`/_pmt/user/verify/payment`,{
        sessionId
});
    return resposne.data
}