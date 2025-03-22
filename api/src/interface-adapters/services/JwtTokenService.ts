import { injectable } from "tsyringe";
import { ITokenService } from "../../entities/services/ITokenService";
import jwt,{JwtPayload,Secret} from "jsonwebtoken";
import { config } from "../../shared/config";
import ms from "ms";

@injectable()
export class JWTService implements ITokenService{
    private accessSecret:Secret;
    private accessExpiresIn:string;
    private refreshSecret:Secret;
    private refreshExpiresIn:string;

    constructor(){
        this.accessSecret = config.jwt.ACCESS_SECRET_KEY;
        this.accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN;
        this.refreshSecret = config.jwt.REFRESH_SECRET_KEY;
        this.refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN
    }

    generateAccessToken(payload: { id: string; email: string; role: string; }): string {
        return jwt.sign(payload,this.accessSecret,{
            expiresIn:this.accessExpiresIn as ms.StringValue,
        })
    }

    generateRefreshToken(payload: { id: string; email: string; role: string; }): string {
        return jwt.sign(payload,this.refreshSecret,{
            expiresIn:this.refreshExpiresIn as ms.StringValue,
        })
    }

    verifyAccessToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token,this.accessSecret) as JwtPayload
        } catch (error) {
            console.error("Access token verification failed:",error);
            return null
        }
    }
    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token,this.refreshSecret) as JwtPayload;
        } catch (error) {
            console.error("Refresh token verification failed:",error);
            return null
        }
    }
    decodeAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload
        } catch (error) {
            console.error("Refresh token verification failed",error);
            return null
        }
    }
}