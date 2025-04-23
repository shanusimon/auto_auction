export interface IUpdateSellerActiveStatusUseCase {
    execute(sellerId:string):Promise<void>
}