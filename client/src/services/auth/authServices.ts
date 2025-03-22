import { api } from "@/api/auth.axios";
import { RegisterData,LoginData } from "../../types/auth";


export const registerUser = async (data: RegisterData) => {
  try {
    const response = await api.post("/signup", data);
    console.log("register response",response)
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Registration failed";
  }
};

export const sendOtp = async (email: string) => {
  try {
    const response = await api.post("/send-otp", { email });
    console.log("Hello Response",response);
    return response;
  } catch (error: any) {
    throw error.response?.data || "Failed to send OTP";
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post("/verify-otp", { email, otp });
    console.log("verify response",response);
    return response;
  } catch (error: any) {
    throw error.response?.data || "Failed in Verify-otp";
  }
};

export const loginUser = async (data:LoginData) => {
  try {
    const response = await api.post("/verify-login",{...data});
    console.log("login data response",response);
    return response;
  } catch (error:any) {
    throw error.response?.data || "Failed to Login User"
  }
}

