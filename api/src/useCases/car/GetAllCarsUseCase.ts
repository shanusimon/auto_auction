import { IGetAllCarsUseCase } from "../../entities/useCaseInterfaces/car/IGetAllCarsUseCase";
import { inject, injectable } from "tsyringe";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { PagenateCars } from "../../entities/models/pageinated-users.entity";
import { IEndAuctionUseCase } from "../../entities/useCaseInterfaces/auction/IEndAuctionUseCase";
import { FilterQuery } from "mongoose";
import { ICarEntity } from "../../entities/models/car.entity";
@injectable()
export class GetAllCarsUseCase implements IGetAllCarsUseCase {
  constructor(
    @inject("ICarRepository") private carRepository: ICarRepository,
    @inject("IEndAuctionUseCase") private endAuctionCarUseCase:IEndAuctionUseCase,
  ) {}
  async execute(
    page: number,
    pageSize: number,
    searchTerm: string
  ): Promise<PagenateCars> {
    await this.processEndedAuctions()
    const validPageNumber = Math.max(1, page || 1);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;

    const filter: FilterQuery<ICarEntity> = {
      approvalStatus: "pending",
    };

    if(searchTerm){
        filter.$or = [
            {title:{$regex:searchTerm,$options:"i"}},
            {make:{$regex:searchTerm,$options:"i"}},
            {model:{$regex:searchTerm,$options:"i"}}
        ]
    }

    const [cars,total] = await Promise.all([
        this.carRepository.findWithPagination(filter,skip,validPageSize),
        this.carRepository.countDocuments(filter)
    ])
    

    return {
        cars,total
    }
  }
 private async processEndedAuctions(){
  try {
    const endedAuction = await this.carRepository.findEndedAuction();
    for(const auction of endedAuction){
      try {
        if(auction._id){
           await this.endAuctionCarUseCase.execute(auction._id.toString());
           console.log(`Processed ended auction ${auction._id}`);
        }
      } catch (error:any) {
        console.error(`Error processing auction ${auction._id}:`, error.message);
      }
    }
  } catch (error:any) {
     console.error(`Error processing auction`, error.message);
  }
 }
}
