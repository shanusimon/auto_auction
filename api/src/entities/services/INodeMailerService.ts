import { ICarEntity } from "../models/car.entity";

export interface INodemailerService {
    sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }>;
    sendRestEmail(email:string,subject:string,resetLink:string):Promise<void>;
    sendCarApprovalEmail(email:string,car:ICarEntity):Promise<void>;
    sendCarRejectEmail(email:string,car:ICarEntity,rejectionReason:string):Promise<void>
}
