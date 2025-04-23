
export interface IUpdateCarStatus {
    execute(carId:string,status:"approved" | "rejected",sellerEmail:string,rejectionReason?:string):Promise<void>;
}