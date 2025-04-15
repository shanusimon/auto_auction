import { SellerDetailsDTO } from "../../../shared/dtos/sellerDetailsDto";

export interface IFindSellerDetailsUseCase {
    execute(sellerId:string):Promise<SellerDetailsDTO>
}