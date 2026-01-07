/**
 * Pure validation functions for auth inputs
 */

/**
 * Check if a value is not empty (after trimming)
 */
export function required(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate email format using a simple regex
 * Note: This is a basic check, not RFC-compliant
 */
export function isValidEmail(email: string): boolean {
  if (!required(email)) {
    return false;
  }

  // Basic email regex: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Check if password meets minimum strength requirements
 * Currently: at least 6 characters
 */
export function isStrongEnoughPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Normalize email for consistent storage and comparison
 * Trims whitespace and converts to lowercase
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
