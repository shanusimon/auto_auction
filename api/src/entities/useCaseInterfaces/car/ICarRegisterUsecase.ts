import { CreateCarDTO } from "../../../shared/dtos/car.dto"

export interface ICarRegisterUseCase {
    execute(userId:string,carDeatails:CreateCarDTO):Promise<void>
}