import { INotification } from "../../entities/models/notification.entity";
import { IGetAllNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IGetAllNotificationsUseCase";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetAllNotificationUseCase implements IGetAllNotificationUseCase{
    constructor(
        @inject("INotificationRepository") private notificationRepositry:INotificationRepository
    ){}
    async execute(userId: string): Promise<INotification[]> {
        const data = await this.notificationRepositry.getAll(userId);
        return data
    }
}