import { inject,injectable } from "tsyringe";
import { ILoginStrategy } from "./login-strategy.interface";
import { IUserEntity } from "../../../entities/models/user.entity";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES,HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dtos/user.dto";

@injectable()
export class AdminLoginStrategy implements ILoginStrategy{
    constructor(
        @inject("IClientRepository") private _clientRepository:IClientRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt:IBcrypt
    ){}
    async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const admin = await this._clientRepository.findByEmail(user.email);
        if(!admin){
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_NOT_FOUND,
                HTTP_STATUS.FORBIDDEN
            );
        }
        if(admin.role!=="admin"){
            throw new CustomError(
                ERROR_MESSAGES.NOT_ALLOWED,
                HTTP_STATUS.BAD_REQUEST
            );
        }
        if(admin.password){
            const isPasswordMatch = await this._passwordBcrypt.compare(
                user.password,
                admin.password,
            )
            if(!isPasswordMatch){
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }
        }
        console.log("Hello Admin")
        return admin

    }
}