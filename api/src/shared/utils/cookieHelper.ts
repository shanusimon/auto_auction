import { Response } from "express"
import { config } from "../config"

export const setAuthCookies = (
    res:Response,
    accessToken:string,
    refreshToken:string,
    accessTokenName:string,
    refreshTokenName:string
)=>{
    const isProduction = config.server.NODE_ENV === "production";

    res.cookie(accessTokenName,accessToken,{
        httpOnly:true,
        secure:isProduction,
        sameSite:"strict"
    });

    res.cookie(refreshTokenName,refreshToken,{
        httpOnly:true,
        secure:isProduction,
        sameSite:"strict"
    })
}

export const clearAuthCookies = (
    res:Response,
    accessTokenName:string,
    refreshTokenName:string
)=>{
    res.clearCookie(accessTokenName);
    res.clearCookie(refreshTokenName);
}

export const updateCookieWithAccessToken = (
    res: Response,
    accessToken: string,
    accessTokenName: string
  ) => {
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie(accessTokenName, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
  };
  