import * as z from "zod";

export interface SignupFormValues {
    fullName: string;
    email: string;
    password: string;
    phoneNumber:string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    phone:string;
    password: string;
    role:string;
  }

  export interface LoginData {
    email:string,
    password:string
    role:"user"|"admin"
  }

 export interface User {
    id:string;
    name:string;
    email:string;
    role:string,
    phone:string,
    profileImage:string,
    bio:string,
    isSeller:boolean,
    walletBalance:number,
    joinedAt:Date
}

export interface IClient {
  _id:string,
  clientId:string,
  name:string,
  email:string,
  phone:string,
  isBlocked:boolean,
  joinedAt:Date
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "client" | "admin";
  };
}

interface WalletTransaction {
    _id: string;
    walletId: string;
    type: "deposit" | "withdraw";
    amount: number;
    status: string;
    stripePaymentId?: string;
    receiptUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WalletTransactionsResponse {
  transactions:WalletTransaction[],
  total:number,
  currentPage:number
}
export interface WalletBalanceResponse {
  balance: number;
}

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
    .min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export interface resetPasswordRequest {
    newPassword:string,
    token:string,
    role:string
}


export const formSchema = z.object({
  isProfessionalDealer: z.boolean().default(false),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter your complete address" }),
  reason: z.string().min(20, { message: "Please provide a detailed reason (min 20 characters)" }),
  identificationNumber: z.string().min(5, { message: "Please provide a valid ID number" }),
  
  businessName: z.string().optional(),
  licenseNumber: z.string().optional(),
  taxID: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  yearsInBusiness: z.string().optional(),
  
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
