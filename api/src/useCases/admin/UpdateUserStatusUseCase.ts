import { inject,injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { IUpdateCustomerStatusUseCase } from "../../entities/useCaseInterfaces/admin/IUpdateCustomerStatusUseCase";

@injectable()
export class UpdateCustomerStatusUseCase implements IUpdateCustomerStatusUseCase{
    constructor(
        @inject("IClientRepository") private clientRepository:IClientRepository
    ){}

    async execute(id: string): Promise<void> {
        console.log("customer id1",id)
        await this.clientRepository.findByIdAndUpdateStatus(id)
    }
}