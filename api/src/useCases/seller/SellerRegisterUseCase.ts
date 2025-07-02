import { ISellerRegisterUseCase } from "../../entities/useCaseInterfaces/seller/ISellerUseCase";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { inject, injectable } from "tsyringe";
import { ISellerEntity } from "../../entities/models/seller.entity";
import { SellerDTO } from "../../shared/dtos/user.dto";
import { ISellerBaseRepository } from "../../entities/repositoryInterfaces/seller/ISellerBaseRepository";


@injectable()
export class SellerRegisterUseCase implements ISellerRegisterUseCase{
    constructor(
        @inject("ISellerRepository") private sellerRepository:ISellerRepository,
        @inject("ISellerBaseRepository") private sellerBaseRepository:ISellerBaseRepository
    ){}
    async execute(dto: SellerDTO): Promise<ISellerEntity> {
        return await this.sellerBaseRepository.create(dto);
    }
}