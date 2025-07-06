import { IBidEntity } from "../../models/bid.entity";
import { CreateBidDTO } from "../../../shared/dtos/bid.dto";

export interface IBidBaseRepository {
  findById(id: string): Promise<IBidEntity | null>;
  create(data: CreateBidDTO): Promise<IBidEntity>;
  delete(id:string):Promise<void>
}
