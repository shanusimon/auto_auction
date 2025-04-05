import { TRole } from "../constants";

export interface UserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user";
}

export interface LoginUserDTO {
  email: string;
  password: string;
  role: TRole;
}

export interface ClientProfileResponse {
  name: string;
  phone: string;
  profileImage: string;
  bio: string;
  email: string;
  joinedAt: Date;
  role: string;
}

export interface SellerDTO {
  userId: string;
  isProfessionalDealer: boolean;
  address: string;
  identificationNumber: string;
  businessName?: string;
  licenseNumber?: string;
  taxID?: string;
  website?: string;
  yearsInBusiness?: string;
}
