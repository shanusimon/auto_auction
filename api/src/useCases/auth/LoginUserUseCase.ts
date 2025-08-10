import {inject,injectable} from "tsyringe";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/ILoginUserUseCase";
import { LoginUserDTO } from "../../shared/dtos/user.dto";
import { ILoginStrategy } from "./login-strategies/login-strategy.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES,HTTP_STATUS } from "../../shared/constants";
import { IUserEntity } from "../../entities/models/user.entity";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase{
    private strategies:Record<string,ILoginStrategy>;
    constructor(
        @inject("ClientLoginStrategy") private _clientLogin:ILoginStrategy,
        @inject("AdminLoginStrategy") private _adminLogin:ILoginStrategy
    ){
        this.strategies = {
            user:_clientLogin,
            admin:_adminLogin
        }
    }
    async execute(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const strategy = this.strategies[user.role];
        if(!strategy){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.FORBIDDEN
            )
        }
        return await strategy.login(user)
    }
}