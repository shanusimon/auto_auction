"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.HTTP_STATUS = void 0;
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
exports.ERROR_MESSAGES = {
    WRONG_ID: "Wrong ID",
    TOKEN_EXPIRED: "Token Expired",
    EMAIL_NOT_FOUND: "Email Not Found",
    FORBIDDEN: "Access denied. You do not have permission to access this resource.",
    BLOCKED: "Your account has been blocked.",
    NOT_ALLOWED: "You are not allowed",
    EMAIL_EXISTS: "Email Already Exists",
    REQUEST_NOT_FOUND: "Category Request Not Found",
    CATEGORY_EXISTS: "Category Already Exists",
    CATEGORY_NOT_FOUND: "Category Not Found",
    INVALID_TOKEN: "Invalid token",
    INVALID_ROLE: "Invalid user role",
    INVALID_CREDENTIALS: "Invalid credentials provided.",
    USER_NOT_FOUND: "User not found.",
    ROUTE_NOT_FOUND: "Route not found",
    UNAUTHORIZED_ACCESS: "Unauthorized access.",
    SERVER_ERROR: "An error occurred, please try again later.",
    VALIDATION_ERROR: "Validation error occurred.",
    MISSING_PARAMETERS: "Missing required parameters.",
    WRONG_CURRENT_PASSWORD: "Current password is wrong",
    SAME_CURR_NEW_PASSWORD: "Please enter a different password from current",
};
