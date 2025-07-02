import { SellerDTO } from "../../../shared/dtos/user.dto";
import { ISellerEntity } from "../../models/seller.entity";

export interface ISellerBaseRepository {
  create(seller: SellerDTO): Promise<ISellerEntity>;
  findByUserId(userId: string): Promise<ISellerEntity | null>;
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ sellers: ISellerEntity[] | []; total: number }>;
  count(filter: any): Promise<number>;
  update(seller: ISellerEntity): Promise<ISellerEntity | null>;
  delete(id: string): Promise<void>;
}
