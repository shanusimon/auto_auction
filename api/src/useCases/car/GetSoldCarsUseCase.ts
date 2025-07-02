import { inject,injectable } from "tsyringe";
import { IGetSoldCarsUseCase } from "../../entities/useCaseInterfaces/car/IGetSoldCarsUseCase";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { ICarEntity } from "../../entities/models/car.entity";

@injectable()
export class getSoldCarsUseCase implements IGetSoldCarsUseCase{
    constructor(
        @inject("ICarRepository") private carRepository:ICarRepository
    ){}
    async execute(): Promise<ICarEntity[] | []> {
        console.log("hello sold car useCase")
        const soldCars = await this.carRepository.findSoldCars();
        console.log("This is sold cars",soldCars)
        return soldCars
    }
}