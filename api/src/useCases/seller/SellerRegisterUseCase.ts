import { ISellerRegisterUseCase } from "../../entities/useCaseInterfaces/seller/ISellerUseCase";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";
import { inject, injectable } from "tsyringe";
import { ISellerEntity } from "../../entities/models/seller.entity";
import { SellerDTO } from "../../shared/dtos/user.dto";



@injectable()
export class SellerRegisterUseCase implements ISellerRegisterUseCase{
    constructor(
        @inject("ISellerRepository") private sellerRepository:ISellerRepository
    ){}
    async execute(dto: SellerDTO): Promise<ISellerEntity> {
        return await this.sellerRepository.create(dto);
    }
}