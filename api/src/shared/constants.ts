export const ROLES = {
	ADMIN:"admin",
	USER:"user"
} as const;

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
	WRONG_ID: "Wrong ID",
	TOKEN_EXPIRED: "Token Expired",
	EMAIL_NOT_FOUND: "Email Not Found",
	FORBIDDEN:
		"Access denied. You do not have permission to access this resource.",
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
} as const;

export const SUCCESS_MESSAGES = {
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
} as const;


export type TRole = "admin" | "user";

export const WALLET_TRANSACTION_TYPES = {
	DEPOSIT:"deposit",
	REFUND:"refund",
	PURCHASE:"purchase"
} as const

export type TWalletTransactionType = keyof typeof WALLET_TRANSACTION_TYPES;

export interface IWalletTransaction {
    type: TWalletTransactionType;
    amount: number;
    timestamp: Date;
}
export const VERIFICATION_MAIL_CONTENT = (
	otp: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
   <!-- Logo & Header Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 42px; font-weight: bold; margin: 0; color: #ff6600;">
         🚗 Auto Auction
      </h1>
   </div>

   <h2 style="color: #ff6600; text-align: center; margin-bottom: 30px;">
      Secure Your Auto Auction Account! 🔑
   </h2>
   
   <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; text-align: center;">
      Welcome to Auto Auction, the leading platform for buying and selling cars! <br> Please use the code below to verify your account.
   </p>
   
   <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin-bottom: 10px; font-size: 16px; font-weight: bold;">Your verification code:</p>
      <h1 style="background-color: #f2f2f2; color: #ff6600; font-size: 36px; margin: 10px 0; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
         ${otp}
      </h1>
      <p style="color: #666; font-size: 14px;">
         ⏳ This code will expire in 5 minutes.
      </p>
   </div>
   
   <p style="font-size: 14px; color: #666; margin-top: 20px; text-align: center;">
      🔒 For security reasons, please do not share this code with anyone.
   </p>

   <!-- Support Section -->
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? Contact our support team! 🚀<br>
         📧 Email: <a href="mailto:support@autoauction.com" style="color: #ff6600; text-decoration: none;">support@autoauction.com</a>
      </p>
   </div>

   <!-- Footer -->
   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} Auto Auction. All rights reserved.
   </div>
</div>`;
