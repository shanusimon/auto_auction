import { Request,Response } from "express";

export interface IPostController{
    createPost(req:Request,res:Response):Promise<void>
    getAllPost(req:Request,res:Response):Promise<void>
    addLike(req:Request,res:Response):Promise<void>
}