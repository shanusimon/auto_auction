import { ISendNotificationUseCase } from "../../entities/useCaseInterfaces/message/ISendNotificationUseCase";
import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { messaging } from "../../shared/config";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { NotificationType } from "../../shared/types/notification.Types";

@injectable()
export class SendNotificationUseCase implements ISendNotificationUseCase {
  constructor(
    @inject("IClientRepository") private clientRepoitory: IClientRepository,
    @inject("INotificationRepository") private notificationRepository:INotificationRepository,
  ) {}
  async execute(userId: string, message: string,senderName:string): Promise<void> {
  
    const user = await this.clientRepoitory.findById(userId);

    await this.notificationRepository.create(userId,NotificationType.CHAT_MESSAGE,message.length > 20 ? message.slice(0,10) + "...":message,`New Message from ${senderName}`)
    
    if (user?.fcmToken) {
      const notification = {
        notification: {
          title: `New Message from ${senderName}`,
          body: message.length > 40 ? message.slice(0, 40) + "..." : message,
        },
        token: user.fcmToken,
      };
      try {
        await messaging.send(notification);
        console.log(`FCM notification sent to user ${userId}`);
      } catch (error) {
        console.log(`FCM notification sent to user ${userId}`);
      }
    }
  }
}
