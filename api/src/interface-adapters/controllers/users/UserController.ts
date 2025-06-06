import { inject, injectable } from "tsyringe";
import { IUserController } from "../../../entities/controllerInterfaces/IUserController";
import { Request, Response, NextFunction } from "express";
import { IGetAllCustomersUseCase } from "../../../entities/useCaseInterfaces/admin/IGetallCustomersUseCase";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IUpdateCustomerStatusUseCase } from "../../../entities/useCaseInterfaces/admin/IUpdateCustomerStatusUseCase";
import { IClientEntity } from "../../../entities/models/client.entity";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { IUpdateProfileUseCase } from "../../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { IUpdatePasswordUseCase } from "../../../entities/useCaseInterfaces/user/IUpadatePasswordUseCase";
import { IIsSellerUseCase } from "../../../entities/useCaseInterfaces/user/IIsSellerUseCase";
import { ISaveFCMTokenUseCase } from "../../../entities/useCaseInterfaces/user/ISaveFcmTokenUseCase";
import { CustomError } from "../../../entities/utils/custom.error";
import { config } from "../../../shared/config";
import axios from "axios";

interface NewsArticle {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("IGetAllCustomersUseCase")
    private getCustomers: IGetAllCustomersUseCase,
    @inject("IUpdateCustomerStatusUseCase")
    private updateCustomers: IUpdateCustomerStatusUseCase,
    @inject("IUpdateProfileUseCase")
    private updateClientProfile: IUpdateProfileUseCase,
    @inject("IUpdatePasswordUseCase")
    private updateClientPassword: IUpdatePasswordUseCase,
    @inject("IsSellerUseCase") private isSellerUseCase: IIsSellerUseCase,
    @inject("SaveFCMTokenUseCase")
    private saveFcmTokenUsecase: ISaveFCMTokenUseCase
  ) {}

 // Get news
  async getNews(req: Request, res: Response): Promise<void> {
    try {
      const NEWS_API_KEY = config.news?.NEWS_API_KEY;
      if (!NEWS_API_KEY) {
        throw new CustomError(
                    "News API key is not configured",
          HTTP_STATUS.INTERNAL_SERVER_ERROR,

        );
      }

      const response = await axios.get<NewsApiResponse>("https://newsapi.org/v2/everything", {
        params: {
          q: '"car" OR "automobile" OR "vehicle" OR "electric car" OR "EV" OR "car industry"',
          domains: "autoexpress.co.uk",
          sortBy: "publishedAt",
          language: "en",
          pageSize: 7,
          apiKey: NEWS_API_KEY,
        },
      });

      const articles: NewsArticle[] = response.data.articles;
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ACTION_SUCCESS,
        data: articles,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                  🛠️ Get Users

  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNumeber = Number(page);
      const pageSize = Number(limit);
      const searchTermString = typeof search === "string" ? search : "";

      const { users, total } = await this.getCustomers.execute(
        pageNumeber,
        pageSize,
        searchTermString
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        users: users,
        totalPages: total,
        currentPage: pageNumeber,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                  🛠️ update Users status

  async updateCustomerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      await this.updateCustomers.execute(userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                 🛠️ update Users Profile

  async updateCustomerProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;
      console.log("hello user profile edit");
      // const {name,phone,profileImage,bio,}:Partial<IClientEntity> = req.body

      const updatedDate: Partial<IClientEntity> = {};

      const allowedField: (keyof IClientEntity)[] = [
        "name",
        "phone",
        "email",
        "profileImage",
        "bio",
      ];

      allowedField.forEach((field) => {
        if (req.body[field] !== undefined) {
          updatedDate[field] = req.body[field];
        }
      });

      const updatedUser = await this.updateClientProfile.execute(
        userId,
        updatedDate
      );

      res.status(HTTP_STATUS.OK).json({
        sucesss: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        data: updatedUser,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                 🛠️ update User Password

  async updateCustomerPassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;

      const { currPass, newPass } = req.body as {
        currPass: string;
        newPass: string;
      };
      console.log("crr", currPass, "new", newPass);
      await this.updateClientPassword.execute(userId, currPass, newPass);

      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.UPDATE_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                 🛠️ check user is a approved seller

  async isSeller(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;

      const seller = await this.isSellerUseCase.execute(userId);
      console.log(seller);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED,
        data: seller,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                 🛠️ store fcm token

  async saveFcmToken(req: Request, res: Response): Promise<void> {
    try {
      console.log("Hello");
      const userId = (req as CustomRequest).user.id;

      const { token } = req.body;
      console.log(token);
      if (!token || typeof token !== "string") {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_TOKEN,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this.saveFcmTokenUsecase.execute(userId, token);

      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.ACTION_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}
