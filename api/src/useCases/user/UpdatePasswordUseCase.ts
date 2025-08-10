import { inject,injectable } from "tsyringe";
import { IUpdatePasswordUseCase } from "../../entities/useCaseInterfaces/user/IUpadatePasswordUseCase";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdatePasswordUseCase implements IUpdatePasswordUseCase{
    constructor(
        @inject("IClientRepository") private _clientRepo:IClientRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt:IBcrypt,
    ){}
    async execute(id: string, currPass: string, newPass: string): Promise<void> {
        const user = await this._clientRepo.findById(id);
        

        
        if(!user){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        const isPasswordMatch = await this._passwordBcrypt.compare(currPass,user.password);

        if(!isPasswordMatch){
            throw new CustomError(
                ERROR_MESSAGES.WRONG_CURRENT_PASSWORD,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const isCurrentMatchWithOld = await this._passwordBcrypt.compare(newPass,user.password);

        if(isCurrentMatchWithOld){
            throw new CustomError(
                ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const hashedPassword = await this._passwordBcrypt.hash(newPass);
        await this._clientRepo.findByIdAndUpdatePassword(id,hashedPassword);
    }
}
