import { TRole } from "../constants";

export interface UserDTO {
    name:string,
    email:string,
    phone:string,
    password:string,
    role: "user"
}

export interface LoginUserDTO{
    email:string;
    password:string;
    role:TRole
}

export interface ClientProfileResponse {
    name: string;
    phone: string;
    profileImage: string;
    bio: string;
    email: string;
    joinedAt: Date;
    role: string;
    walletBalance: number;
}
