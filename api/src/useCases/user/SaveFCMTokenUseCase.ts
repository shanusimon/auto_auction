import { ISaveFCMTokenUseCase } from "../../entities/useCaseInterfaces/user/ISaveFcmTokenUseCase";
import { inject,injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";


@injectable()
export class SaveFCMTokenUseCase implements ISaveFCMTokenUseCase{
    constructor(
        @inject("IClientRepository") private clientrepository:IClientRepository,
    ){}
    async execute(userId: string, token: string): Promise<void> {
        await this.clientrepository.updateFcmToken(userId,token);
    }
}