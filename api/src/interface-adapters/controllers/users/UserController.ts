import { inject,injectable } from "tsyringe";
import { IUserController } from "../../../entities/controllerInterfaces/IUserController";
import { Request, Response, NextFunction } from "express";
import { IGetAllCustomersUseCase } from "../../../entities/useCaseInterfaces/admin/IGetallCustomersUseCase";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IUpdateCustomerStatusUseCase } from "../../../entities/useCaseInterfaces/admin/IUpdateCustomerStatusUseCase";
import { IClientEntity } from "../../../entities/models/client.entity";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { IUpdateProfileUseCase } from "../../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { IUpdatePasswordUseCase } from "../../../entities/useCaseInterfaces/user/IUpadatePasswordUseCase";



@injectable()
export class UserController implements IUserController{
    constructor(
        @inject("IGetAllCustomersUseCase") private getCustomers:IGetAllCustomersUseCase,
        @inject("IUpdateCustomerStatusUseCase") private updateCustomers:IUpdateCustomerStatusUseCase,
        @inject("IUpdateProfileUseCase") private updateClientProfile:IUpdateProfileUseCase,
        @inject("IUpdatePasswordUseCase") private updateClientPassword:IUpdatePasswordUseCase
    ){}

  //*                  🛠️ Get Users

    async getAllCustomers(req: Request, res: Response): Promise<void> {
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

    async updateCustomerStatus(req: Request, res: Response): Promise<void> {
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

     //*                 🛠️ update Users Profile

     async updateCustomerProfile(req: Request, res: Response): Promise<void> {
         try {

            const userId = (req as CustomRequest).user.id;

            // const {name,phone,profileImage,bio,}:Partial<IClientEntity> = req.body

            const updatedDate:Partial<IClientEntity> = {}

            const allowedField:(keyof IClientEntity)[]=[
                "name",
                "phone",
                "email",
                "profileImage",
                "bio"
            ]

            allowedField.forEach((field)=>{
                if(req.body[field] !== undefined){
                    updatedDate[field] = req.body[field]
                }
            })

            const updatedUser = await this.updateClientProfile.execute(userId,updatedDate);

            res.status(HTTP_STATUS.OK).json({
                sucesss:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                data:updatedUser
            });        
            
         } catch (error) {
            handleErrorResponse(res,error)
         }
     }

    //*                 🛠️ update User Password

    async updateCustomerPassword(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id

            const {currentPassword,newPassword}= req.body as {
                currentPassword:string,
                newPassword:string
            }

            await this.updateClientPassword.execute(userId,currentPassword,newPassword)

            res.status(HTTP_STATUS.OK).json({sucesss:true,message:SUCCESS_MESSAGES.UPDATE_SUCCESS})

        } catch (error) {
            handleErrorResponse(res,error)
        }
    }

}