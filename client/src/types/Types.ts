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


export interface ISellerEntity {
  _id?: string;
  userId: string | User;
  address: string;
  identificationNumber: string;
  approvalStatus: "pending" | "approved" | "rejected";
  sellerSince?: string | Date; 
  isProfessionalDealer: boolean;
  businessDetails?: {
    businessName: string;
    businessLicenseNumber?: string;
    website?: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isActive: boolean;
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
  isProfessionalDealer: z.boolean(),
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  identificationNumber: z.string().min(1, "ID number is required"),
  businessName: z.string().optional(),
  licenseNumber: z.string().optional(),
  taxID: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  yearsInBusiness: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
}).refine(
  (data) => {
    if (data.isProfessionalDealer) {
      return !!data.businessName && !!data.licenseNumber && !!data.taxID;
    }
    return true;
  },
  {
    message: "Business Name, License Number, and Tax ID are required for professional dealers",
    path: ["businessName"],
  }
);
export type FormValues = z.infer<typeof formSchema>;

export interface SellerRequestPayload {
  isProfessionalDealer: boolean;
  address: string;
  identificationNumber: string;
  businessName?: string;
  licenseNumber?: string;
  taxID?: string;
  website?: string;
  yearsInBusiness?: string;
}


