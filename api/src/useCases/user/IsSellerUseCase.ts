import { IIsSellerUseCase } from "../../entities/useCaseInterfaces/user/IIsSellerUseCase";
import { inject,injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class IsSellerUseCase implements IIsSellerUseCase{
    constructor(
        @inject("IClientRepository") private clientRepository:IClientRepository
    ){}
    async execute(id: string): Promise<boolean> {
        const user = await this.clientRepository.findById(id);
        if(!user){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        if(!user?.isSeller){
            return false
        }
        return true
    }
}