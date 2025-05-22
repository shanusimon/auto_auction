import { IUpdateNotificationUseCase } from "../../entities/useCaseInterfaces/notifications/IUpdateNotificationUseCase";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateNotificationUseCase implements IUpdateNotificationUseCase{
    constructor(
        @inject("INotificationRepository") private notificationRepository:INotificationRepository
    ){}
    async execute(userId:string,id?: string, all?: string): Promise<void> {
        if(id){
            await this.notificationRepository.updateToRead(id);
        }else if(all){
            await this.notificationRepository.updateAllToRead(userId)
        }
    }
}