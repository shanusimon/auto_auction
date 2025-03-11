export interface INodemailerService {
    sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }>;
}
