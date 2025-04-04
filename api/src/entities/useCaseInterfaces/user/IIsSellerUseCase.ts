export interface IIsSellerUseCase{
    execute(id:string):Promise<boolean>
}