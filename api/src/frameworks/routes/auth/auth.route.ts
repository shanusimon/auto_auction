import { Request,Response } from "express";
import { BaseRoute } from "../base.route";


export class AuthRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post("/signup",(req:Request,res:Response)=>{
            console.log(req.body);
            res.send("Signup router called");
        })
        this.router.get("/home",(req:Request,res:Response)=>{
            res.send("Hello Auto Auction")
        })
    }
}