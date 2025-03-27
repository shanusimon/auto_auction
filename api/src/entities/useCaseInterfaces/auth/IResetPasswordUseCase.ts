export interface IResetPasswordUseCase{
    execute(newPassword:string,token:string,role:string):Promise<void>;
}