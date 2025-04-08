export interface IRevokeFCMTokenUseCase{
    execute(id:string):Promise<void>
}