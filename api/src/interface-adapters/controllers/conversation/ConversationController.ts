import { Request, Response } from "express"
import { IConversationController } from "../../../entities/controllerInterfaces/conversation/IConversation"
import { CustomRequest } from "../../middlewares/authMiddleware"
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IGetConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IGetConversationUseCase";
import { inject,injectable } from "tsyringe";
import { IGetAllConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IGetAllConversationsUseCase";

@injectable()
export class ConversationController implements IConversationController{
    constructor(
        @inject("IGetConversationUseCase") private _getConversationUseCase:IGetConversationUseCase,
        @inject("IGetAllConversationUseCase") private _getAllConversation:IGetAllConversationUseCase
    ){}
    async getConversation(req: Request, res: Response): Promise<void> {
        try {
            console.log("hello")
            const userId = (req as CustomRequest).user.id;
            const {sellerId} = req.body;
            if(!userId || !sellerId){
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }
            let conversation = await this._getConversationUseCase.execute(userId,sellerId);

            res.status(HTTP_STATUS.OK).json({conversationId:conversation.id})
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
    async getAllConversations(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;

            const conversations = await this._getAllConversation.execute(userId);

            res.status(HTTP_STATUS.OK).json({conversations})
        
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
}