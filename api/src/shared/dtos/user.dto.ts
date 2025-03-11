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