import { Request, Response } from "express";
import { ISellerController } from "../../../entities/controllerInterfaces/seller/ISellerController";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { SellerDTO } from "../../../shared/dtos/user.dto";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { ISellerRegisterUseCase } from "../../../entities/useCaseInterfaces/seller/ISellerUseCase";
import { IGetAllSellerRequestUseCase } from "../../../entities/useCaseInterfaces/seller/IGetAllSellerRequestUseCase";
import { CustomError } from "../../../entities/utils/custom.error";
import { IUpdateSellerStatusUseCase } from "../../../entities/useCaseInterfaces/seller/IUpdateSellerStatusUseCase";
import { IFindSellerDetailsUseCase } from "../../../entities/useCaseInterfaces/seller/IFindSellerDetails";
import { IUpdateSellerActiveStatusUseCase } from "../../../entities/useCaseInterfaces/seller/IUpdateSellerActiveStatusUseCase";
import { IGetSellerStatisticsUseCase } from "../../../entities/useCaseInterfaces/seller/ISellerStatistics";

@injectable()
export class SellerController implements ISellerController {
  constructor(
    @inject("ISellerRegisterUseCase")
    private _sellerUseCase: ISellerRegisterUseCase,
    @inject("IGetAllSellerRequestUseCase")
    private _getAllSellerRequestUseCase: IGetAllSellerRequestUseCase,
    @inject("IUpdateSellerStatusUseCase")
    private _updateSellerStatusUseCase: IUpdateSellerStatusUseCase,
    @inject("IFindSellerDetailsUseCase")
    private _findSellerDetailsUseCase: IFindSellerDetailsUseCase,
    @inject("IUpdateSellerActiveStatusUseCase")
    private _updateSellerActiveStatusUseCase: IUpdateSellerActiveStatusUseCase,
    @inject("IGetSellerStatisticsUseCase")
    private _getSellerStatusUseCase: IGetSellerStatisticsUseCase
  ) {}
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;
      const {
        isProfessionalDealer,
        address,
        identificationNumber,
        businessName,
        licenseNumber,
        taxID,
        website,
        yearsInBusiness,
      } = req.body;

      const dto: SellerDTO = {
        userId,
        isProfessionalDealer,
        address,
        identificationNumber,
        ...(isProfessionalDealer && {
          businessDetails: {
            businessName,
            licenseNumber,
            taxID,
            website,
            yearsInBusiness,
          },
        }),
      };

      await this._sellerUseCase.execute(dto);

      res
        .status(HTTP_STATUS.CREATED)
        .json({ success: true, message: SUCCESS_MESSAGES.CREATED });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getAllSellerRequest(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const pageSize = Math.max(1, parseInt(limit as string) || 10);
      const searchTermString = typeof search === "string" ? search : "";

      const { sellers, total } = await this._getAllSellerRequestUseCase.execute(
        pageNum,
        pageSize,
        searchTermString,
        true
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        sellers,
        totalPages: total,
        currentPage: pageNum,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async updateSellerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params as { userId?: string };
      const { status, reason } = req.body as {
        status?: string;
        reason?: string;
      };

      console.log("UserID:", userId, "Status:", status, "Reason:", reason);

      if (!userId || typeof userId !== "string") {
        throw new CustomError(
          "User ID is required and must be a string",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (!status || !["approved", "rejected"].includes(status)) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (status === "rejected" && (!reason || reason.trim() === "")) {
        throw new CustomError(
          "Rejection reason is required when status is rejected",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this._updateSellerStatusUseCase.execute(
        userId,
        status as "approved" | "rejected",
        reason
      );

      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getSellerDetails(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params as { sellerId?: string };
      if (!sellerId) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const userDetails = await this._findSellerDetailsUseCase.execute(sellerId);
      console.log(userDetails);

      res.status(HTTP_STATUS.OK).json({ userDetails });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async getAllApprovedSellers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const pageSize = Math.max(1, parseInt(limit as string) || 10);
      const searchTermString = typeof search === "string" ? search : "";
      const { sellers, total } = await this._getAllSellerRequestUseCase.execute(
        pageNum,
        pageSize,
        searchTermString,
        false
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        sellers,
        totalPages: total,
        currentPage: pageNum,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async updateSellerActiveStatus(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      if (!sellerId) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      await this._updateSellerActiveStatusUseCase.execute(sellerId);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async getSellerStatistics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;

      const data = await this._getSellerStatusUseCase.execute(userId);
      console.log("this is the data",data)
      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED,
        data,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}
