import { inject,injectable } from "tsyringe";
import { Request,Response } from "express";
import { IRegisterUserUseCase } from "../../../entities/useCaseInterfaces/auth/register-usecase.interface";
import { UserDTO } from "../../../shared/dtos/user.dto";
import { userSignupSchemas } from "../validations/user-signup.validation.schema";
import { ERROR_MESSAGES,HTTP_STATUS,SUCCESS_MESSAGES } from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom.error";


@injectable()
export class RegisterUserController{
    constructor(
        @inject("IRegisterUserUseCase")
        private registerUserUseCase:IRegisterUserUseCase
    ){}
    async handle(req:Request,res:Response):Promise<void>{
        try {
            const {role} = req.body as UserDTO;
            const schema = userSignupSchemas[role];
            if(!schema){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.INVALID_CREDENTIALS
                });
                return;
            }
            console.log("before validate",req.body)
            const vaildateData = schema.parse(req.body);
            console.log("validate",vaildateData)
            await this.registerUserUseCase.execute(vaildateData);
            res.status(HTTP_STATUS.CREATED).json({
                success:true,
                message:SUCCESS_MESSAGES.REGISTRATION_SUCCESS
            });
        } catch (error) {
            
             // 🟢 1️⃣ If the error is a validation error from Zod
            if(error instanceof ZodError){    
                const errors = error.errors.map((err)=>{
                    return{
                        path: err.path.join('.'),message:err.message}
                })

                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.VALIDATION_ERROR,
                    errors
                });
                return;
            }

            // 🔴 2️⃣ If the error is a custom application error (CustomError)
            if (error instanceof CustomError) {
				res.status(error.statusCode).json({
					success: false,
					message: error.message,
				});
				return;
			}

            // ❌ 3️⃣ If it's an unexpected error, log it and return a generic error message
            console.log("Error at Register-controller", error);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: ERROR_MESSAGES.SERVER_ERROR,
			});

        }
    }
}