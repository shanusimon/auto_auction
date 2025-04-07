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

@injectable()
export class SellerController implements ISellerController {
  constructor(
    @inject("ISellerRegisterUseCase")
    private sellerUseCase: ISellerRegisterUseCase,
    @inject("IGetAllSellerRequestUseCase")
    private getAllSellerRequestUseCase: IGetAllSellerRequestUseCase,
    @inject("IUpdateSellerStatusUseCase")
    private updateSellerStatusUseCase: IUpdateSellerStatusUseCase
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

      await this.sellerUseCase.execute(dto);

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

      const { sellers, total } = await this.getAllSellerRequestUseCase.execute(
        pageNum,
        pageSize,
        searchTermString
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
      const { status } = req.body as { status?: string }; 
      console.log(userId,status)
      if (!userId || typeof userId !== "string") {
        throw new CustomError("User ID is required and must be a string", HTTP_STATUS.BAD_REQUEST);
    }
    if (!status || !["approved", "rejected"].includes(status)) {
        throw new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
    }
    console.log("heelo controllerrrrr");
      await this.updateSellerStatusUseCase.execute(String(userId), status as "approved" | "rejected");

      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}
