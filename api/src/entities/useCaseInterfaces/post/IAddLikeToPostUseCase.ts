
export interface IPostLikeUseCase {
    execute(userId:string,postId:string):Promise<void>
}