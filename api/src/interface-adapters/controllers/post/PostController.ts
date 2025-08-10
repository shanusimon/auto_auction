import { Request, Response } from "express";
import { IPostController } from "../../../entities/controllerInterfaces/post/IPostController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { ICreatePostUseCase } from "../../../entities/useCaseInterfaces/post/ICreatePostUseCase";
import { inject, injectable } from "tsyringe";
import { CreatePostDTO } from "../../../shared/dtos/post.dto";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { IGetPagenatedPostsUseCase } from "../../../entities/useCaseInterfaces/post/IGetPagnatedPosts";
import { CustomError } from "../../../entities/utils/custom.error";
import { IPostLikeUseCase } from "../../../entities/useCaseInterfaces/post/IAddLikeToPostUseCase";

@injectable()
export class PostController implements IPostController{
    constructor(
        @inject("ICreatePostUseCase") private _createPostUseCase:ICreatePostUseCase,
        @inject("IGetPagenatedPostsUseCase") private _getPagenatedPosts:IGetPagenatedPostsUseCase,
        @inject("IPostLikeUseCase") private _postLikeUseCase:IPostLikeUseCase
    ){}
    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;

            const data = req.body as CreatePostDTO;

            await this._createPostUseCase.execute(data,userId);

            res.status(HTTP_STATUS.CREATED).json({message:SUCCESS_MESSAGES.CREATED});
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
    async getAllPost(req: Request, res: Response): Promise<void> {
        try {
            const skip = parseInt(req.query.skip as string) || 0;
            const limit = parseInt(req.query.limit as string) || 5;

            const posts  = await this._getPagenatedPosts.execute(limit,skip);
            console.log(posts);
            res.status(HTTP_STATUS.OK).json({data:posts});
        } catch (error) {
            handleErrorResponse(res,error);
        }
    }
    async addLike(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as CustomRequest).user.id;
            const {postId} = req.params;
            
            if(!postId){
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }

            await this._postLikeUseCase.execute(userId,postId);
            
            res.status(HTTP_STATUS.OK).json({message:SUCCESS_MESSAGES.ACTION_SUCCESS});
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }
}