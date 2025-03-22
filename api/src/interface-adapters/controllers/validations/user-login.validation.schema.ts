import { z } from "zod";
import { strongEmailRegex } from "../../../shared/validation/email.validation";
import { passwordSchema } from "../../../shared/validation/password.validation";

export const loginSchema = z.object({
    email:strongEmailRegex,
    password:passwordSchema,
    role:z.enum(["admin","user"])
})