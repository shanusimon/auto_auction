//module import 
import { container } from "tsyringe";

//respoitory imports
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ClientRepository } from "../../interface-adapters/repositories/client/client.repository";
import { IUserExistenceService } from "../../entities/services/Iuser-existence-service.interface";
import { UserExistenceService } from "../../interface-adapters/services/UserExistenceService";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { RedisClient } from "../redis/redisClient";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/IRefreshToken-RepositoryInterface";
import { RefreshTokenRepository } from "../../interface-adapters/repositories/auth/refreshTokenRepository";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/IRedisTokenRepository";
import { RedisTokenRepository } from "../../interface-adapters/repositories/redis/RedisTokenRepository";

//service imports
import { IOtpService } from "../../entities/services/IOtpService";
import { OtpService } from "../../interface-adapters/services/OtpService";
import { INodemailerService } from "../../entities/services/INodeMailerService";
import { NodemailerService } from "../../interface-adapters/services/NodemailerService";
import { JWTService } from "../../interface-adapters/services/JwtTokenService";
import { ITokenService } from "../../entities/services/ITokenService";

export class RepositoryRegistry{
    static registerRepositories():void{
        container.register<IClientRepository>("IClientRepository",{
            useClass:ClientRepository
        });
        container.register<IUserExistenceService>("IUserExistenceService",{
            useClass:UserExistenceService
        });
        container.register<IRefreshTokenRepository>("IRefreshTokenRepository",{
            useClass:RefreshTokenRepository
        });
        container.register<IOtpService>("IOtpService",{
            useClass:OtpService
        });
        container.register<INodemailerService>("INodemailerService",{
            useClass:NodemailerService
        });
        container.register<IRedisClient>("IRedisClient",{
            useClass:RedisClient
        });
        container.register<ITokenService>("ITokenService",{
            useClass:JWTService
        });
        container.register<IClientRepository>("IClientRepository",{
            useClass:ClientRepository
        });
        container.register<IRedisTokenRepository>("IRedisTokenRepository",{
            useClass:RedisTokenRepository
        })
    }
}