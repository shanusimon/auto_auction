import { useMutation } from "@tanstack/react-query";
import { registerUser, sendOtp, verifyOtp,loginUser, googleAuth, forgetPassword, resetPassword} from "../../services/auth/authServices";
import { logoutUser } from "@/services/user/userServices";
import { AuthResponse, LoginData, RegisterData } from "../../types/Types";


export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onError: (error: Error) => {
      console.error("Registration error:", error);
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => sendOtp(email),
    onError: (error: Error) => {
      console.error("Sending OTP Error", error);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => verifyOtp(email, otp),
    onError: (error: Error) => {
      console.error("OTP Verification Error", error);
    },
  });
};

export const useLogin = ()=>{
  return useMutation({
    mutationFn:(data:LoginData)=>loginUser(data),
    onError:(error:Error)=>{
      console.log("Error on login user",error)
    }
  })
}

export const useLogout = ()=>{
  return useMutation({
    mutationFn:logoutUser,
    onError:(error:Error)=>{
      console.log("Error on Logout user",error)
    }
  })
}

export const useGoogleAuth = () =>{
  return useMutation<
  AuthResponse,
  Error,
  {credential:any; client_id:any;role:string}>({
    mutationFn:googleAuth
})
}


export const useForgetPassword = () =>{
    return useMutation({
      mutationFn:forgetPassword,
      onError:(error:Error)=>{
        console.log("Error on ForgetPassword",error)
      }
    })
} 


export const useResetPassword = ()=>{
  return useMutation({
    mutationFn:resetPassword,
    onError:(error:Error)=>{
      console.log("Error on Reset Password",error)
    }
  })
}