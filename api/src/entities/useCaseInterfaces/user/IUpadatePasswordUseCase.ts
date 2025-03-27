export interface IUpdatePasswordUseCase {
    execute(id:string,currPass:string,newPass:string):Promise<void>;
}