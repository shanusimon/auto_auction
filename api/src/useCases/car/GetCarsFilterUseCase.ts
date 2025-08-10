import { IGetCarsFilterUseCase } from "../../entities/useCaseInterfaces/car/IGetCarsFilterUseCase";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { inject,injectable } from "tsyringe";
import { ICarEntity } from "../../entities/models/car.entity";
import { ICarFilter } from "../../shared/dtos/car.dto";
@injectable()
export class GetCarsFilterUseCase implements IGetCarsFilterUseCase {
    constructor(
        @inject("ICarRepository") private _carRepository: ICarRepository
    ) {}
    
    async execute(filter: ICarFilter, page: number, limit: number): Promise<ICarEntity[]> {
        const { year, bodyType, fuel, transmission, sort = "ending-soon" } = filter;
        
        const query: ICarFilter = {};
        
        if (year) query.year = year;
        if (bodyType) query.bodyType = bodyType;
        if (fuel) query.fuel = fuel;
        if (transmission) query.transmission = transmission;
        
        const validSortOptions = ['ending-soon', 'newly-listed', 'no-reserve'];
        const sortOption = validSortOptions.includes(sort) ? sort : 'ending-soon';
        
        return this._carRepository.getFilteredCars(query, sortOption, page, limit);
    }
}