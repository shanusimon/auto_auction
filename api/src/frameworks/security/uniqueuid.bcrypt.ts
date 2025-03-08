import { randomUUID } from "crypto";

export const generateUniqueUid = (prefix:string = "auto_auction")=>{
    return `auto_auction-${prefix}-${randomUUID().slice(10)}`
};