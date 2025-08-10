import { inject,injectable } from "tsyringe";
import { IGetSoldCarsUseCase } from "../../entities/useCaseInterfaces/car/IGetSoldCarsUseCase";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { ICarEntity } from "../../entities/models/car.entity";

@injectable()
export class getSoldCarsUseCase implements IGetSoldCarsUseCase{
    constructor(
        @inject("ICarRepository") private _carRepository:ICarRepository
    ){}
    async execute(): Promise<ICarEntity[] | []> {
        const soldCars = await this._carRepository.findSoldCars();
        return soldCars
    }
}