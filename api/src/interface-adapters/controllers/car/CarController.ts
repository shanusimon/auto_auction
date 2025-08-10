import { ICarController } from "../../../entities/controllerInterfaces/car/ICarController";
import { inject, injectable } from "tsyringe";
import { CreateCarDTO, ICarFilter } from "../../../shared/dtos/car.dto";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { ICarRegisterUseCase } from "../../../entities/useCaseInterfaces/car/ICarRegisterUsecase";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { IGetAllCarsUseCase } from "../../../entities/useCaseInterfaces/car/IGetAllCarsUseCase";
import { CustomError } from "../../../entities/utils/custom.error";
import { IUpdateCarStatus } from "../../../entities/useCaseInterfaces/car/IUpdateCarStatus";
import { IGetCarsFilterUseCase } from "../../../entities/useCaseInterfaces/car/IGetCarsFilterUseCase";
import { ICarEntity } from "../../../entities/models/car.entity";
import { BodyType, FuelType, TransmissionType } from "../../../shared/types/car.types";
import { IGetCarDetailsUseCase } from "../../../entities/useCaseInterfaces/car/ICarDetailsUseCase";
import { IGetSoldCarsUseCase } from "../../../entities/useCaseInterfaces/car/IGetSoldCarsUseCase";

@injectable()
export class CarController implements ICarController {
  constructor(
    @inject("ICarRegisterUseCase")
    private _carRegisterUsecase: ICarRegisterUseCase,
    @inject("IGetAllCarsUseCase") 
    private _getAllCarsUseCase: IGetAllCarsUseCase,
    @inject("IUpdateCarStatus")
    private _updateCarStatusUseCase: IUpdateCarStatus,
    @inject("IGetCarsFilterUseCase")
    private _getCarsFilterUseCase: IGetCarsFilterUseCase,
    @inject("IGetCarDetailsUseCase")
    private _getCarDetailsUseCase:IGetCarDetailsUseCase,
    @inject("IGetSoldCarsUseCase")
    private _getSoldCarUseCase:IGetSoldCarsUseCase
  ) {}
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;

      const carDetails = req.body as CreateCarDTO;

      await this._carRegisterUsecase.execute(userId, carDetails);

      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: SUCCESS_MESSAGES.CREATED });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async getAllCars(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const pageSize = Math.max(1, parseInt(limit as string) || 10);
      const searchTermString = typeof search === "string" ? search : "";

      const { cars, total } = await this._getAllCarsUseCase.execute(
        pageNum,
        pageSize,
        searchTermString
      );



      res.status(HTTP_STATUS.OK).json({ cars, total, page: pageNum, pageSize });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async updateCarStatus(req: Request, res: Response): Promise<void> {
    try {
      const { carId } = req.params as { carId?: string };
      const { status, rejectionReason, sellerEmail } = req.body as {
        status: string;
        rejectionReason?: string;
        sellerEmail: string;
      };

      if (!carId || typeof carId !== "string" || !sellerEmail) {
        throw new CustomError(
          ERROR_MESSAGES.CAR_UPDATE_CREDENTIALS_MISSING,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      if (!status || !["approved", "rejected"].includes(status)) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      if (status === "rejected" && !rejectionReason) {
        throw new CustomError(
          ERROR_MESSAGES.REJECTION_REASON_IS_MISSING,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      await this._updateCarStatusUseCase.execute(
        carId,
        status as "approved" | "rejected",
        sellerEmail,
        rejectionReason
      );

      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async getCarsWithFilter(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        year: req.query.year,
        transmission: req.query.transmission as TransmissionType,
        bodyType: req.query.bodyType as BodyType,
        fuel: req.query.fuel as FuelType,
        sort: req.query.sort || "ending-soon",
      } as ICarFilter;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;



      const cars:ICarEntity[] = await this._getCarsFilterUseCase.execute(
        filters,
        page,
        limit
      );

      const transformedCars  = cars.map((car)=>({
        id:car._id?.toString(),
        title:car.title,
        year:car.year,
        make:car.make,
        model:car.model,
        imageUrl:car.images[0] || "",
        currentBid:car.highestBid || 0,
        location:car.location,
        auctionEndTime: car.auctionEndTime ? car.auctionEndTime.toISOString() : null,
        noReserve: !car.reservedPrice,
        approvalStatus:car.approvalStatus,
        specs:[car.transmission,car.fuel,car.bodyType].filter(Boolean)
      }))

      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.DATA_RETRIEVED, data:transformedCars });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  async getCarDetails(req: Request, res: Response): Promise<void> {

      try {
        const {id} = req.params;
 
        if(!id){
          throw new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS,HTTP_STATUS.BAD_REQUEST)
        }

        const {car,seller} = await this._getCarDetailsUseCase.execute(id);
        if(!car){
          throw new CustomError(
            ERROR_MESSAGES.CAR_NOT_FOUND,HTTP_STATUS.NOT_FOUND
          )
        }

        res.status(HTTP_STATUS.OK).json({message:SUCCESS_MESSAGES.DATA_RETRIEVED,data:car,seller})
      } catch (error) {
        handleErrorResponse(res,error);
      }
  }
  async getSoldCars(req: Request, res: Response): Promise<void> {
      try {
        console.log("hello")
        const soldCars = await this._getSoldCarUseCase.execute();
        console.log("this is sold car",soldCars);
        
        res.status(HTTP_STATUS.OK).json({data:soldCars})
      } catch (error) {
        handleErrorResponse(res,error)
      }
  }

}
