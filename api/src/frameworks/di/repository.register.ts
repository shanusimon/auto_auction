//module import 
import { container } from "tsyringe";

//respoitory imports

import { IClientRepository } from "../../entities/useCaseInterfaces/client/client-repository.interface";
import { ClientRepository } from "../../interface-adapters/repositories/client/client.repository";
import { IUserExistenceService } from "../../entities/services/Iuser-existence-service.interface";
import { UserExistenceService } from "../../interface-adapters/services/user-existence.service";
import { IRedisClient } from "../../entities/services/IRedisClient";
import { RedisClient } from "../redis/redisClient";
import { IOtpService } from "../../entities/services/IOtpService";
import { OtpService } from "../../interface-adapters/services/OtpService";
import { INodemailerService } from "../../entities/services/INodeMailerService";
import { NodemailerService } from "../services/NodemailerService";

export class RepositoryRegistry{
    static registerRepositories():void{
        container.register<IClientRepository>("IClientRepository",{
            useClass:ClientRepository
        });

        container.register<IUserExistenceService>("IUserExistenceService",{
            useClass:UserExistenceService
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
    }
}