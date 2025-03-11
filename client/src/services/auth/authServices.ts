import { api } from "@/api/auth.axios";
import { RegisterData } from "../../types/auth";


export const registerUser = async (data: RegisterData) => {
    try {
        const response = await api.post("/signup",data);
        return response.data;
    } catch (error:any) {
        throw error.response?.data || "Registration failed"; 
    }
  };

export const sendOtp = async(email:string)=>{
    const response = await api.post("/send-otp",email)
    return response.data
}
  