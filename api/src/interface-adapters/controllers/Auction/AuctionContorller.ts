import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { IAuctionController } from "../../../entities/controllerInterfaces/Auction/IAuctionController";
import { IEndAuctionUseCase } from "../../../entities/useCaseInterfaces/auction/IEndAuctionUseCase";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { IGetWonAuctionUseCase } from "../../../entities/useCaseInterfaces/auction/IGetWonAuctionUseCase";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { CustomError } from "../../../entities/utils/custom.error";
import { ICreateCheckOutSessionUseCase } from "../../../entities/useCaseInterfaces/auction/ICreateCheckOutSessionUseCase";
import { IVerifyPaymentUseCase } from "../../../entities/useCaseInterfaces/auction/IVerifyPaymentUseCase";
import { IPaymentService } from "../../../entities/services/IStripeService"; // Add IPaymentService

@injectable()
export class AuctionController implements IAuctionController {
  constructor(
    @inject("IEndAuctionUseCase") private endAuctionUseCase: IEndAuctionUseCase,
    @inject("IGetWonAuctionUseCase")
    private getAuctionWonUseCase: IGetWonAuctionUseCase,
    @inject("ICreateCheckOutSessionUseCase")
    private createCheckOutSessionUseCase: ICreateCheckOutSessionUseCase,
    @inject("IVerifyPaymentUseCase")
    private verifyPaymentUseCase: IVerifyPaymentUseCase,
    @inject("IPaymentService") private stripeService: IPaymentService // Inject StripeService
  ) {}

  async endAuction(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const result = await this.endAuctionUseCase.execute(id);
      if (result) {
        res.status(200).json({
          success: true,
          message:
            result.auctionStatus === "sold"
              ? "Auction ended successfully"
              : "Auction ended without meeting reserve price",
          data: result,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Auction ended with no winner",
        });
      }
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }

  async getWonAuction(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    try {
      const wonAuction = await this.getAuctionWonUseCase.execute(userId);
      res.status(HTTP_STATUS.OK).json({ data: wonAuction });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async createCheckOutSession(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const auctionId = req.params.auctionId;
    try {
      if (!auctionId) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const sessionId = await this.createCheckOutSessionUseCase.execute(
        auctionId.toString(),
        userId
      );

      res.status(HTTP_STATUS.CREATED).json({
        data: { sessionId },
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async verifyPayment(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { sessionId } = req.body;

    try {
      if (!sessionId) {
        throw new CustomError("Missing session ID", HTTP_STATUS.BAD_REQUEST);
      }

      const auctionWon = await this.verifyPaymentUseCase.execute(userId, sessionId);
      const session = await this.stripeService.getCheckOutSession(sessionId); 

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Payment verified and updated successfully",
        data: { auctionWon, session }, 
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}