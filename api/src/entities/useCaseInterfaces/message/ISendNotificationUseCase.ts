
export interface ISendNotificationUseCase{
    execute(userId:string,message:string,senderName:string):Promise<void>;
}