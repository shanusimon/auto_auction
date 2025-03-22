import { injectable,inject } from "tsyringe";
import { IRedisTokenRepository } from "../../../entities/repositoryInterfaces/redis/IRedisTokenRepository";
import { IRedisClient } from "../../../entities/services/IRedisClient";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository{
    constructor(@inject("IRedisClient") private redisClient:IRedisClient){}
    async blackListToken(token: string, expiresIn: number): Promise<void> {
        await this.redisClient.setex(token,expiresIn,"blacklisted")
    }
    async isTokenBlackListed(token: string): Promise<boolean> {
        const value = await this.redisClient.get(token)
        return value === "blacklisted"
    }
}