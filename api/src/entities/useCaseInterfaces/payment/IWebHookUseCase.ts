export interface IWebHookUseCase {
    execute(sig:string,body:Buffer | string):Promise<void>
}