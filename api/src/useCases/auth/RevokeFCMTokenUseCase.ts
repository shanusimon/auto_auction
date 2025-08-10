import { IRevokeFCMTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRevokeFCMTokenUseCase";
import { inject,injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";

@injectable()
export class RevokeFCMTokenUseCase implements IRevokeFCMTokenUseCase{
    constructor(
        @inject("IClientRepository") private _clientrepository:IClientRepository,
    ){}
    async execute(id: string): Promise<void> {
        await this._clientrepository.revokeFcmToken(id);
    }
}