
import { ITransactionController } from "../../../entities/controllerInterfaces/transaction/ITransactionController";
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IGetWalletTransactionsUseCase } from "../../../entities/useCaseInterfaces/transactions/IGetAllTransactionUseCase";

@injectable()
export class TransactionController implements ITransactionController {
    constructor(
        @inject("IGetWalletTransactionsUseCase") private _walletTransactionUseCase:IGetWalletTransactionsUseCase
    ) {}

    async getAllTransaction(req: Request, res: Response): Promise<void> {
        try {
            const customReq = req as unknown as CustomRequest;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;
            if (page < 1 || limit < 1) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_CREDENTIALS,
                });
                return;
            }
            const userId = customReq.user.id;

            const result =  await this._walletTransactionUseCase.execute(userId,page,limit);
            console.log("hello trasnctions",result);
            res.status(HTTP_STATUS.OK).json({
                success:true,
                data:result,
                message:SUCCESS_MESSAGES.DATA_RETRIEVED
            })

        } catch (error) {
            handleErrorResponse(res, error);
        }
    }
}