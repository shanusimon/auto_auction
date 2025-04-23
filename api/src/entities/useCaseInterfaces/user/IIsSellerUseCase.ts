export interface IIsSellerUseCase{
    execute(id:string):Promise<{ isSeller: boolean; sellerDetails?: any;  isActive:boolean}>
}