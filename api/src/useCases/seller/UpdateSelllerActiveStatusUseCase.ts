import { IUpdateSellerActiveStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerActiveStatusUseCase";
import { inject,injectable } from "tsyringe";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";

@injectable()
export class UpdateSellerActiveStatus implements IUpdateSellerActiveStatusUseCase{
    constructor(
        @inject("ISellerRepository") private sellerRepository:ISellerRepository
    ){}
    async execute(sellerId: string): Promise<void> {
        await this.sellerRepository.findByIdAndUpdateStatus(sellerId);
    }
}