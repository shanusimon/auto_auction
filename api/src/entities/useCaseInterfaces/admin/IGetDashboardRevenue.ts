export interface IGetDashboardRevenueUseCase{
    execute(period:string):Promise<{name:string;revenue:number}[]>
}