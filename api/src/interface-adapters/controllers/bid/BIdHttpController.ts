import { IBidHttpController } from "../../../entities/controllerInterfaces/bid/IBidHttpController";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { Request, Response } from "express";
import { GetAllBidsUseCase } from "../../../useCases/bid/GetAllBidsUseCase";
import { inject, injectable } from "tsyringe";
import { HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES } from "../../../shared/constants";
import { IGetBidHistoryUseCase } from "../../../entities/useCaseInterfaces/bid/IGetBidHistoryUseCase";

@injectable()
export class BidHttpController implements IBidHttpController {
  constructor(
    @inject("IGetAllBidsUseCase") private getAllbidUseCase: GetAllBidsUseCase,
    @inject("IGetBidHistoryUseCase") private getBidHistoryUseCase:IGetBidHistoryUseCase
) {}
  async GetAllBids(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;
      const data = await this.getAllbidUseCase.execute(userId);
      res.status(HTTP_STATUS.OK).json({ data });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async getBidHistory(req: Request, res: Response): Promise<void> {
      try {
        const userId = (req as CustomRequest).user.id;
        const {carId} = req.params;
        if(!userId){
            throw new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS,HTTP_STATUS.BAD_REQUEST)
        }
        const bids = await this.getBidHistoryUseCase.execute(carId);
        console.log(bids);
        
        res.status(HTTP_STATUS.OK).json({bids});
      } catch (error) {
        handleErrorResponse(res,error)
      }
  }
}
