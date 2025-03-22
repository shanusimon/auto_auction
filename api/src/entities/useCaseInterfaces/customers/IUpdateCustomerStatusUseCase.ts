export interface IUpdateCustomerStatusUseCase {
    execute(id:string):Promise<void>
}