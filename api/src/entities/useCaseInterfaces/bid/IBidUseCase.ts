export interface IPlaceBidUseCase{
    execute(amount:number,carId:string,userId:string):Promise<void>
}