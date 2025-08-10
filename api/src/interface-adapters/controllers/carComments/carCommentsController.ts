import { Request, Response } from "express";
import { ICarCommentController } from "../../../entities/controllerInterfaces/carComments/ICarComments";
import { inject,injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { CreateCommentDto } from "../../../shared/dtos/create.car.comment.dto";
import { ICreateCommentUseCase } from "../../../entities/useCaseInterfaces/comments/ICreateCommentUseCase";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IGetAllCommentsAndBidsUseCase } from "../../../entities/useCaseInterfaces/comments/IGetAllCommentsAndBidsUseCase";

@injectable()
export class CarCommentController implements ICarCommentController{
    constructor(
        @inject("ICreateCommentUseCase") private _CreateCarCommentUseCase:ICreateCommentUseCase,
        @inject('IGetAllCommentsAndBidsUseCase') private _GetAllCommentsAndBidUseCase:IGetAllCommentsAndBidsUseCase
    ){}
    async create(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;

            const commentData = req.body as CreateCommentDto;

            if(!commentData.content || commentData.content.trim() === ""){
                throw new CustomError(
                   ERROR_MESSAGES.COMMENT_REQUIRED,
                    HTTP_STATUS.BAD_REQUEST
                )
            }

            await this._CreateCarCommentUseCase.execute({...commentData,userId});

            res.status(HTTP_STATUS.CREATED).json({message:SUCCESS_MESSAGES.CREATED})


        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
    async getCarCommentsAndBids(req: Request, res: Response): Promise<void> {
        try {

            const { carid } = req.params;

            if (!carid) {
              res.status(400).json({ message: "Car ID is required" });
              return;
            }
            const data = await this._GetAllCommentsAndBidUseCase.execute(carid);
            console.log(data);

            res.status(HTTP_STATUS.OK).json({data})

        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
}