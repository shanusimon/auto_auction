import { ILoginStrategy } from "./login-strategy.interface";
import { inject,injectable } from "tsyringe";
import { IUserEntity } from "../../../entities/models/user.entity";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES,HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dtos/user.dto";


@injectable()
export class ClientLoginStrategy implements ILoginStrategy{
    constructor(
        @inject("IClientRepository") private _clientRepository:IClientRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt:IBcrypt
    ) {}
    async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const client = await this._clientRepository.findByEmail(user.email);
        if(!client){
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }
        if(client.isBlocked){
            throw new CustomError(
                ERROR_MESSAGES.BLOCKED,
                HTTP_STATUS.NOT_FOUND
            );
        }
        if(user.password){
            const isPasswordMatch = await this._passwordBcrypt.compare(
                user.password,
                client.password, 
            );
            console.log("passwordMatch",isPasswordMatch);
            if(!isPasswordMatch){
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }
        }
        return client;
    }
}