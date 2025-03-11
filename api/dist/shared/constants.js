"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WALLET_TRANSACTION_TYPES = exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.HTTP_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: "admin",
    USER: "user"
};
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
exports.SUCCESS_MESSAGES = {
    BOOKING_SUCCESS: "Booking completed",
    CREATED: "Created successfully",
    LOGIN_SUCCESS: "Login successful",
    REGISTRATION_SUCCESS: "Registration completed successfully",
    OTP_SEND_SUCCESS: "OTP sent successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    UPDATE_SUCCESS: "Updated successfully",
    DELETE_SUCCESS: "Deleted successfully",
    OPERATION_SUCCESS: "Operation completed successfully",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",
    VERIFICATION_SUCCESS: "Verification completed successfully",
    DATA_RETRIEVED: "Data retrieved successfully",
    ACTION_SUCCESS: "Action performed successfully",
};
exports.WALLET_TRANSACTION_TYPES = {
    DEPOSIT: "deposit",
    REFUND: "refund",
    PURCHASE: "purchase"
};
