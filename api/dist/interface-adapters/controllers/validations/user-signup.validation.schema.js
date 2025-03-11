"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSignupSchemas = void 0;
const zod_1 = require("zod");
const email_validation_1 = require("../../../shared/validation/email.validation");
const password_validation_1 = require("../../../shared/validation/password.validation");
const name_validation_1 = require("../../../shared/validation/name.validation");
const phone_validation_1 = require("../../../shared/validation/phone.validation");
// Signup schema for "user" only
const userSignupSchema = zod_1.z.object({
    name: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phone: phone_validation_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    role: zod_1.z.literal('user')
});
exports.userSignupSchemas = {
    user: userSignupSchema
};
// Login schema for both "user" and "admin"
exports.loginSchema = zod_1.z.object({
    email: email_validation_1.strongEmailRegex,
    passwordSchema: password_validation_1.passwordSchema,
    role: zod_1.z.enum(["admin", "user"])
});
