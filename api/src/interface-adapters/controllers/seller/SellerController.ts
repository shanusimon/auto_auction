import { Request, Response } from "express";
import { ISellerController } from "../../../entities/controllerInterfaces/seller/ISellerController";
import { inject,injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { SellerDTO } from "../../../shared/dtos/user.dto";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { ISellerRegisterUseCase } from "../../../entities/useCaseInterfaces/seller/ISellerUseCase";

@injectable()
export class SellerController implements ISellerController{
    constructor(
      @inject("ISellerRegisterUseCase") private sellerUseCase:ISellerRegisterUseCase
    ){}
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
                  businessName,
                  licenseNumber,
                  taxID,
                  website,
                  yearsInBusiness,
                }),
              };

              await this.sellerUseCase.execute(dto);
              
            res.status(HTTP_STATUS.CREATED).json({success:true,message:SUCCESS_MESSAGES.CREATED});
        } catch (error) {
            handleErrorResponse(res,error);
        }
    }
}