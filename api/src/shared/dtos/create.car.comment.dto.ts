export interface CreateCommentDto {
    carId:string;
    userId:string
    content:string;
    parentId?:string
}