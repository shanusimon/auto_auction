import { ERROR_MESSAGES } from "../../../shared/constants";
import { passwordSchema } from "../../../shared/validation/password.validation";
import {z} from "zod";

export const resetPasswordValidationSchema = z.object({
    newPassword:passwordSchema,
    token:z.string(),
    role:z.enum(["admin","user"],{
        message:ERROR_MESSAGES.INVALID_ROLE
    })
})