import { inject,injectable } from "tsyringe";
import { ICustomerController } from "../../entities/controllerInterfaces/ICustomerController";
import { Request, Response, NextFunction } from "express";
import { IGetAllCustomersUseCase } from "../../entities/useCaseInterfaces/customers/IGetallCustomersUseCase";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IUpdateCustomerStatusUseCase } from "../../entities/useCaseInterfaces/customers/IUpdateCustomerStatusUseCase";




@injectable()
export class CustomerController implements ICustomerController{
    constructor(
        @inject("IGetAllCustomersUseCase") private getCustomers:IGetAllCustomersUseCase,
        @inject("IUpdateCustomerStatusUseCase") private updateCustomers:IUpdateCustomerStatusUseCase
    ){}

  //*                  🛠️ Get Users

    async getAllCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {page = 1,limit = 10,search = ""} = req.query;
            const pageNumeber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = typeof search === "string" ? search : "";

            const {users,total} = await this.getCustomers.execute(pageNumeber,pageSize,searchTermString);

            res.status(HTTP_STATUS.OK).json({
                success:true,
                users:users,
                totalPages:total,
                currentPage:pageNumeber
            })
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }

 //*                  🛠️ update Users status

    async updateCustomerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
     try {
        const {userId} = req.params;
        
        await this.updateCustomers.execute(userId)
        res.status(HTTP_STATUS.OK).json({
            success:true,
            message:SUCCESS_MESSAGES.UPDATE_SUCCESS
        })
     } catch (error) {
        handleErrorResponse(res,error)
     }   
    }
}