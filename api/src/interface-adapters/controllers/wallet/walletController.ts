import { IWalletController } from "../../../entities/controllerInterfaces/IWalletController";
import { inject,injectable } from "tsyringe";
import { IAddMoneyToWalletUseCase } from "../../../entities/useCaseInterfaces/wallet/IAddMoneyToWalletUseCase";
import { Request, Response, NextFunction } from "express";
import {  HTTP_STATUS } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { IGetWalletDeatailsUseCase } from "../../../entities/useCaseInterfaces/wallet/IGetWalletDeatailsUseCase";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";


@injectable()
export class WalletController implements IWalletController{
    constructor(
        @inject("IAddMoneyToWalletUseCase") private _addMoneytoWalletUseCase:IAddMoneyToWalletUseCase,
        @inject("IGetWalletDeatailsUseCase") private _getWalletDetailsUseCase:IGetWalletDeatailsUseCase
    ){}
    async addMoneyToWallet(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;

            const {amount} = req.body;
            
            const amountInCents = Math.round(amount * 100);

            if(!amount || amount <= 0){
                res.status(HTTP_STATUS.BAD_REQUEST).json({success:false,
                    message:"Invalid amount"
                })
                return
            }

            const {clientSecret} = await this._addMoneytoWalletUseCase.execute(userId,amountInCents);
            
            console.log("this is client secret",clientSecret)
            
            res.status(HTTP_STATUS.OK).json({clientSecret})
        
        } catch (error:any) {
          
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Failed to initiate payment", error: error.message });
        
        }
    }
    async getWalletBalance(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;
            const walletData = await this._getWalletDetailsUseCase.execute(userId)
           
            res.status(HTTP_STATUS.OK).json({walletData})
        } catch (error) {
           handleErrorResponse(res,error)
        }
    }
}