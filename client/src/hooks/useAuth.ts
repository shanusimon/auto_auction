import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth/authServices"
import { RegisterData } from "../types/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onError: (error: Error) => {
      console.error("Registration error:", error);
    },
  });
};