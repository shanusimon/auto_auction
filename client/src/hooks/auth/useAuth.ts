import { useMutation } from "@tanstack/react-query";
import { registerUser, sendOtp, verifyOtp } from "../../services/auth/authServices";
import { RegisterData } from "../../types/auth";

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
