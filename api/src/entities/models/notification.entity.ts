import { ObjectId } from "mongoose";
import { NotificationType } from "../../shared/types/notification.Types";

export interface INotification {
    userId:ObjectId | string;
    type:NotificationType,
    message:string,
    title:string,
    isRead:boolean,
}
