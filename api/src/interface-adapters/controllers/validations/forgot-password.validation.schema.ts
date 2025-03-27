import { ERROR_MESSAGES } from "../../../shared/constants";
import { strongEmailRegex } from "../../../shared/validation/email.validation";
import {z} from "zod";

export const forgotEmailValidationSchema = z.object({
    email:strongEmailRegex,
    role:z.enum(["user","admin"],{
        message:ERROR_MESSAGES.INVALID_ROLE
    }),
})