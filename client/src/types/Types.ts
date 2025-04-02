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
    role: "client" | "admin" | "vendor";
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