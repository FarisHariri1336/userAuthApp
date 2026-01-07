/**
 * Typed error codes for auth operations
 */
export type AuthErrorCode =
  | "MISSING_FIELDS"
  | "INVALID_EMAIL"
  | "WEAK_PASSWORD"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND"
  | "STORAGE_ERROR"
  | "UNKNOWN_ERROR";

/**
 * Custom error class for auth operations
 */
export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  MISSING_FIELDS: "Please fill in all required fields.",
  INVALID_EMAIL: "Please enter a valid email address.",
  WEAK_PASSWORD: "Password must be at least 6 characters long.",
  EMAIL_ALREADY_EXISTS:
    "This email is already registered. Please login instead.",
  INVALID_CREDENTIALS: "Incorrect email or password.",
  USER_NOT_FOUND: "Account not found.",
  STORAGE_ERROR: "Failed to save data. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};
