import { INotification } from "../../models/notification.entity";


export interface IUpdateNotificationUseCase{
    execute(userId:string,id?:string,all?:string):Promise<void>;
}