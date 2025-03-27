import { inject,injectable } from "tsyringe";
import { IUpdatePasswordUseCase } from "../../entities/useCaseInterfaces/user/IUpadatePasswordUseCase";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class UpdatePasswordUseCase implements IUpdatePasswordUseCase{
    constructor(
        @inject("IClientRepository") private clientRepo:IClientRepository,
        @inject("IPasswordBcrypt") private passwordBcrypt:IBcrypt
    ){}
    async execute(id: string, currPass: string, newPass: string): Promise<void> {
        const user = await this.clientRepo.findById(id);

        if(!user){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const isPasswordMatch = await this.passwordBcrypt.compare(currPass,newPass);

        if(isPasswordMatch){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const isCurrentMatchWithOld = await this.passwordBcrypt.compare(newPass,currPass);

        if(isCurrentMatchWithOld){
            throw new CustomError(
                ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const hashedPassword = await this.passwordBcrypt.hash(newPass);

        await this.clientRepo.findByIdAndUpdatePassword(id,hashedPassword);
    }
}
