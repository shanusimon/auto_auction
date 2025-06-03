import { Request, Response } from "express";
import { IRevenueController } from "../../../entities/controllerInterfaces/Revenue/IRevenueController";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IGetDashboardRevenueUseCase } from "../../../entities/useCaseInterfaces/admin/IGetDashboardRevenue";
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IGetAdminDashBoardUseCase } from "../../../entities/useCaseInterfaces/admin/IGetAdminDashboardUseCase";

@injectable()
export class RevenueController implements IRevenueController{
    constructor(
        @inject("IGetDashboardRevenueUseCase") private dashBoardRevenueUseCase:IGetDashboardRevenueUseCase,
        @inject("IGetAdminDashBoardUseCase") private adminDashBoardUseCase:IGetAdminDashBoardUseCase
    ){}
    async getChartData(req: Request, res: Response): Promise<void> {
        try {
         const { period } = req.query;
      if (!['weekly', 'monthly', 'yearly'].includes(period as string)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
        return;
      }
            const revenue = await this.dashBoardRevenueUseCase.execute(period as string);
            res.status(HTTP_STATUS.OK).json(revenue);
        } catch (error) {
         handleErrorResponse(res,error);   
        }
    }
async getAdminDashboard(req: Request, res: Response): Promise<void> {
    try {
      const dashboardData = await this.adminDashBoardUseCase.execute();
      console.log(dashboardData);
      res.status(HTTP_STATUS.OK).json(dashboardData);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}