import { PagenateSellers } from "../../entities/models/pageinated-users.entity";
import { IGetAllSellerRequestUseCase } from "../../entities/useCaseInterfaces/seller/IGetAllSellerRequestUseCase";
import { inject, injectable } from "tsyringe";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";

@injectable()
export class GetAllSellerUseCase implements IGetAllSellerRequestUseCase {
  constructor(
    @inject("ISellerRepository") private sellerRepository: ISellerRepository,
    @inject("IClientRepository") private clientRepository: IClientRepository
  ) {}
  async execute(
    page: number,
    pageSize: number,
    searchTerm: string,
    isRequestTable: boolean
  ): Promise<PagenateSellers> {
    const validPageNumber = Math.max(1, page || 1);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;

    let filter: any = {
      approvalStatus: isRequestTable ? "pending" : "approved",
    };

    if (searchTerm) {
      const matchingUserIds = await this.clientRepository.findBySearchTerm(
        searchTerm
      );
      if (matchingUserIds.length > 0) {
        filter.userId = { $in: matchingUserIds };
      } else {
        return { sellers: [], total: 0 };
      }
    }
    const [sellers, total] = await Promise.all([
      this.sellerRepository.findPaginatedAndPopulated(filter, skip, validPageSize),
      this.sellerRepository.count(filter),
    ]);

    const response: PagenateSellers = {
      sellers: sellers.sellers,
      total: Math.ceil(total / validPageSize),
    };

    return response;
  }
}
