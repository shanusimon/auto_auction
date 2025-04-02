export interface IAddMoneyToWalletUseCase{
    execute(walletId:string,amount:number):Promise<{clientSecret:string}>
}