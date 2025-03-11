"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserController = void 0;
const tsyringe_1 = require("tsyringe");
const user_signup_validation_schema_1 = require("../validations/user-signup.validation.schema");
const constants_1 = require("../../../shared/constants");
const zod_1 = require("zod");
const custom_error_1 = require("../../../entities/utils/custom.error");
let RegisterUserController = class RegisterUserController {
    constructor(registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.body;
                const schema = user_signup_validation_schema_1.userSignupSchemas[role];
                if (!schema) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS
                    });
                    return;
                }
                const vaildateData = schema.parse(req.body);
                yield this.registerUserUseCase.execute(vaildateData);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.REGISTRATION_SUCCESS
                });
            }
            catch (error) {
                // 🟢 1️⃣ If the error is a validation error from Zod
                if (error instanceof zod_1.ZodError) {
                    const errors = error.errors.map((err) => {
                        message: err.message;
                    });
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                        errors
                    });
                    return;
                }
                // 🔴 2️⃣ If the error is a custom application error (CustomError)
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                    return;
                }
                // ❌ 3️⃣ If it's an unexpected error, log it and return a generic error message
                console.log("Error at Register-controller", error);
                res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        });
    }
};
exports.RegisterUserController = RegisterUserController;
exports.RegisterUserController = RegisterUserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IRegisterUserUseCase")),
    __metadata("design:paramtypes", [Object])
], RegisterUserController);
