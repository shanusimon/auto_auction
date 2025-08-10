import { inject,injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { IUpdateProfileUseCase } from "../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { CustomError } from "../../entities/utils/custom.error";
import { IClientEntity } from "../../entities/models/client.entity";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ClientProfileResponse } from "../../shared/dtos/user.dto";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase{
    constructor(
        @inject("IClientRepository") private _clientRepo:IClientRepository,
    ){}
    async execute(clientId: string, data: Partial<IClientEntity>): Promise<ClientProfileResponse> {
        const isExist = await this._clientRepo.findById(clientId);

        if(!isExist){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

       const updatedProfile = await this._clientRepo.updateProfileById(clientId,data);

       if (!updatedProfile) {
        throw new CustomError(
            "Failed to update profile",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }

       return updatedProfile
    }
}