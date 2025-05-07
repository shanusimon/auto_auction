import { z } from "zod";

export const bidSchema = z.object({
    carId:z.string().min(1),
    amount:z.number().positive(),
    userId:z.string().min(1)
})