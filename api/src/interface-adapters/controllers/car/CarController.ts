import { ICarController } from "../../../entities/controllerInterfaces/car/ICarController";
import { inject,injectable } from "tsyringe";
import { CreateCarDTO } from "../../../shared/dtos/car.dto";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { ICarRegisterUseCase } from "../../../entities/useCaseInterfaces/car/ICarRegisterUsecase";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { IGetAllCarsUseCase } from "../../../entities/useCaseInterfaces/car/IGetAllCarsUseCase";

@injectable()
export class CarController implements ICarController{
    constructor(
        @inject("ICarRegisterUseCase") private carRegisterUsecase:ICarRegisterUseCase,
        @inject("IGetAllCarsUseCase") private getAllCarsUseCase:IGetAllCarsUseCase
    ){}
    async register(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;

            const carDetails = req.body as CreateCarDTO;            

            await this.carRegisterUsecase.execute(userId,carDetails);

            res.status(HTTP_STATUS.CREATED).json({message:SUCCESS_MESSAGES.CREATED})
        } catch (error) {
            handleErrorResponse(res,error);
        }
    }
    async getAllCars(req: Request, res: Response): Promise<void> {
        try {
            const {page = 1,limit = 10,search = ""}= req.query;
            const pageNum = Math.max(1,parseInt(page as string) || 1);
            const pageSize = Math.max(1,parseInt(limit as string) || 10);
            const searchTermString = typeof search === "string" ? search : "";

            const {cars,total}= await this.getAllCarsUseCase.execute(pageNum,pageSize,searchTermString);

            res.status(HTTP_STATUS.OK).json({cars,total,page:pageNum,
                pageSize
            })

        } catch (error) {
            handleErrorResponse(res,error);
        }
    }
}