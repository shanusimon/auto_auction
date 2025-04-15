import { IGetAllCarsUseCase } from "../../entities/useCaseInterfaces/car/IGetAllCarsUseCase";
import { inject, injectable } from "tsyringe";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/carRepository";
import { PagenateCars } from "../../entities/models/pageinated-users.entity";

@injectable()
export class GetAllCarsUseCase implements IGetAllCarsUseCase {
  constructor(
    @inject("ICarRepository") private carRepository: ICarRepository
  ) {}
  async execute(
    page: number,
    pageSize: number,
    searchTerm: string
  ): Promise<PagenateCars> {
    const validPageNumber = Math.max(1, page || 1);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;

    const filter: any = {
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
        this.carRepository.find(filter,skip,validPageSize),
        this.carRepository.count(filter)
    ])

    return {
        cars,total
    }
  }
}
