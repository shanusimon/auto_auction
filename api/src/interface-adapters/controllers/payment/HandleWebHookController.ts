import { Request, Response } from "express";
import { IHandleWebHookController } from "../../../entities/controllerInterfaces/IHandleWebHookController";
import { HTTP_STATUS } from "../../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IWebHookUseCase } from "../../../entities/useCaseInterfaces/payment/IWebHookUseCase";

@injectable()
export class HandleWebHookController implements IHandleWebHookController{
    constructor(
        @inject("IWebHookUseCase") private webHookUseCase:IWebHookUseCase
    ){}
    async handle(req: Request, res: Response): Promise<void> {
        const sig = req.headers["stripe-signature"];


        if(!sig || typeof sig !== "string"){
            res.status(HTTP_STATUS.BAD_REQUEST)
            .json({success:false,message:"Missing stripe signature"})
            return
        }

        await this.webHookUseCase.execute(sig,req.body);
        res.status(HTTP_STATUS.OK).json({received:true})
    }
}