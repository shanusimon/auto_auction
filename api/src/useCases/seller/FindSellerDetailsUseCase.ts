import { IFindSellerDetailsUseCase } from "../../entities/useCaseInterfaces/seller/IFindSellerDetails";
import { inject,injectable } from "tsyringe";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { SellerDetailsDTO } from "../../shared/dtos/sellerDetailsDto";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class FindSellerDetailsUseCase implements IFindSellerDetailsUseCase{
    constructor(
        @inject("ISellerRepository") private sellerRepository:ISellerRepository,
        @inject("IClientRepository") private clientRepository:IClientRepository
    ){}
    async execute(sellerId: string): Promise<SellerDetailsDTO> {
        const seller = await this.sellerRepository.findOne(sellerId);
        if(!seller){
            throw new CustomError(ERROR_MESSAGES.SELLER_NOT_FOUND,HTTP_STATUS.BAD_REQUEST);
        }
        const userDetails = await this.clientRepository.findById(seller.userId);

        if(!userDetails){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        return {
            name:userDetails.name!,
            email:userDetails.email!,
            profileImage:userDetails.profileImage,
            phone:userDetails.phone,
            address:seller.address,
            joinedDate:seller.sellerSince,
            identificationNumber:seller.identificationNumber,
            isProfessionalDealer:seller.isProfessionalDealer,
        }

    }
}