import { Request, Response } from "express";
import { INotificationController } from "../../../entities/controllerInterfaces/notification/INotificationController";
import { IGetAllNotificationUseCase } from "../../../entities/useCaseInterfaces/notifications/IGetAllNotificationsUseCase";
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { IUpdateNotificationUseCase } from "../../../entities/useCaseInterfaces/notifications/IUpdateNotificationUseCase";
@injectable()
export class NotificationController implements INotificationController{
    constructor(
        @inject("IGetAllNotificationUseCase") private getAllNotificationUseCase:IGetAllNotificationUseCase,
        @inject("IUpdateNotificationUseCase") private updateNotificationUsecase:IUpdateNotificationUseCase
    ){}
    async getNotifcations(req: Request, res: Response): Promise<void> {
        try {
         const userId = (req as CustomRequest).user.id;
         const data = await this.getAllNotificationUseCase.execute(userId);
         res.status(HTTP_STATUS.OK).json({data})
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
 async updateNotification(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as CustomRequest).user.id;
        const { id, all } = req.body;
        if (!id && !all) {
     res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
}

        if (id) {
            await this.updateNotificationUsecase.execute(userId, id);
        } else if (all) {
            await this.updateNotificationUsecase.execute(userId, undefined, all);
        }

        res.status(HTTP_STATUS.OK).json({ message: SUCCESS_MESSAGES.ACTION_SUCCESS });

    } catch (error) {
        handleErrorResponse(res, error);
    }
}

}