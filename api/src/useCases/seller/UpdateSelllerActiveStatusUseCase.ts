import { IUpdateSellerActiveStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerActiveStatusUseCase";
import { inject,injectable } from "tsyringe";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";

@injectable()
export class UpdateSellerActiveStatus implements IUpdateSellerActiveStatusUseCase{
    constructor(
        @inject("ISellerRepository") private _sellerRepository:ISellerRepository
    ){}
    async execute(sellerId: string): Promise<void> {
        await this._sellerRepository.findByIdAndUpdateStatus(sellerId);
    }
}