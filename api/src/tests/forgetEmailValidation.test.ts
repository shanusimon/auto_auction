import { forgotEmailValidationSchema } from "../interface-adapters/controllers/validations/forgot-password.validation.schema";// Update with the correct path
import { ERROR_MESSAGES } from "../shared/constants";

describe("Forgot Email Validation Schema", () => {
  test("✅ Should pass with a valid email and role", () => {
    const validData = {
      email: "test@example.com",
      role: "user",
    };

    expect(() => forgotEmailValidationSchema.parse(validData)).not.toThrow();
  });

  test("❌ Should fail if email is missing", () => {
    const invalidData = {
      role: "admin",
    };

    expect(() => forgotEmailValidationSchema.parse(invalidData)).toThrow();
  });

  test("❌ Should fail if role is invalid", () => {
    const invalidData = {
      email: "test@example.com",
      role: "manager", // Invalid role
    };

    expect(() => forgotEmailValidationSchema.parse(invalidData)).toThrow(ERROR_MESSAGES.INVALID_ROLE);
  });

  test("❌ Should fail if email format is incorrect", () => {
    const invalidData = {
      email: "invalid-email",
      role: "user",
    };

    expect(() => forgotEmailValidationSchema.parse(invalidData)).toThrow();
  });
});
