import { IIsSellerUseCase } from "../../entities/useCaseInterfaces/user/IIsSellerUseCase";
import { inject,injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";

@injectable()
export class IsSellerUseCase implements IIsSellerUseCase {
    constructor(
        @inject("IClientRepository") private clientRepository: IClientRepository,
        @inject("ISellerRepository") private sellerRepository: ISellerRepository
    ) {}

    async execute(id: string): Promise<{ isSeller: boolean; sellerDetails?: any; isActive:boolean}> {
        const user = await this.clientRepository.findById(id);
        if (!user || !user.id) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            );
        }
        
        const seller = await this.sellerRepository.findByUserId(user.id);
        console.log(seller);
        return {
            isSeller: seller?.approvalStatus === "approved" ? true : false,
            sellerDetails: seller ? {
                approvalStatus: seller.approvalStatus,
            } : null,
            isActive:seller?.isActive ?? false, 
        };
    }
}