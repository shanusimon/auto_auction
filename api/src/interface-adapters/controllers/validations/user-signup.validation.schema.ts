import {z} from "zod";

import { strongEmailRegex } from "../../../shared/validation/email.validation";
import { passwordSchema } from "../../../shared/validation/password.validation";
import { nameSchema } from "../../../shared/validation/name.validation";
import { phoneNumberSchema } from "../../../shared/validation/phone.validation";


// Signup schema for "user" only
const userSignupSchema = z.object({
    name:nameSchema,
    email:strongEmailRegex,
    phone:phoneNumberSchema,
    password:passwordSchema,
    role:z.literal('user')
})

export const userSignupSchemas ={
    user:userSignupSchema
}

// Login schema for both "user" and "admin"
export const loginSchema = z.object({
    email:strongEmailRegex,
    passwordSchema:passwordSchema,
    role:z.enum(["admin","user"])
})