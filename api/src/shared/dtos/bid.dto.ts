export interface CreateBidDTO {
    amount:number,
    carId:string,
    userId:string,
    depositHeld:number;
    status:"active" | "outbid" | "won"
}