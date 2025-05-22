
export interface CreatePostDTO{
    userId:String,
    description:string,
    mediaType:"image" | "video",
    media:string
}