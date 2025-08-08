import { IBidEntity } from "../../models/bid.entity";
import { CreateBidDTO } from "../../../shared/dtos/bid.dto";

export interface IBidRepository {
  findById(id: string): Promise<IBidEntity | null>;
  create(data: CreateBidDTO): Promise<IBidEntity>;
  delete(id: string): Promise<void>;
  findHighestBidByCarAndUser(
    carId: string,
    userId: string
  ): Promise<IBidEntity | null>;
  updateStatus(id: string, status: string): Promise<void>;
  findAllByCarId(carId: string): Promise<IBidEntity[]>;
  findByUserId(userId: string): Promise<IBidEntity[]>;
  countBidsForSeller(userId: string): Promise<number>;
  countBidsForCar(carId: string): Promise<number>;
  findTopBidByCarId(carId: string): Promise<IBidEntity | null>;
}
