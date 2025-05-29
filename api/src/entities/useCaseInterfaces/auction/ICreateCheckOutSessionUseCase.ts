export interface ICreateCheckOutSessionUseCase{
    execute(auctionId:string,userId:string):Promise<string>
}