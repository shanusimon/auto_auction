import { SellerDTO } from "../../../shared/dtos/user.dto";
import { ISellerEntity } from "../../models/seller.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ISellerRepository extends IBaseRepository<ISellerEntity>{
  findSellerDetails(_id: string): Promise<ISellerEntity | null>;
  findByIdAndUpdateStatus(id: string): Promise<void>;
  create(seller: SellerDTO): Promise<ISellerEntity>;
  findByUserId(userId: string): Promise<ISellerEntity | null>;
  findPaginatedAndPopulated(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ sellers: ISellerEntity[] | []; total: number }>;
  count(filter: any): Promise<number>;
  update(seller: ISellerEntity): Promise<ISellerEntity | null>;
}
