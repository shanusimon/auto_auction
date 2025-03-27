export interface IForgetPasswordUseCase{
    execute(email:string,role:string):Promise<void>;
}