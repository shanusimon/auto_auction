import { IBidBaseRepository } from "../../../entities/repositoryInterfaces/bid/IBidBaseRepository";
import { BidModel } from "../../../frameworks/database/models/bid.model";
import { IBidEntity } from "../../../entities/models/bid.entity";
import { CreateBidDTO } from "../../../shared/dtos/bid.dto";

export class BidBaseRepository  implements IBidBaseRepository {
  constructor() {}
  async findById(id:string):Promise<IBidEntity | null>{
    return BidModel.findById(id);
  }
  async delete(id: string): Promise<void> {
    await BidModel.findByIdAndDelete(id);
  }
  async create(data: CreateBidDTO): Promise<IBidEntity> {
    return await BidModel.create(data);
  }
}
