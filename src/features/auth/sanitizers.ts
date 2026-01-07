/**
 * Input sanitization functions
 * Ensures user input is safe and within expected bounds
 */

/**
 * Sanitize name input
 * - Trims whitespace
 * - Removes excessive whitespace
 * - Limits length to 100 characters
 * - Allows alphanumeric, spaces, hyphens, and apostrophes only
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^a-zA-Z0-9\s'-]/g, '') // Remove special characters except hyphen and apostrophe
    .slice(0, 100); // Max length 100
}

/**
 * Sanitize email input
 * - Trims whitespace
 * - Converts to lowercase
 * - Removes invalid characters
 * - Limits length to 254 characters (RFC 5321)
 */
export function sanitizeEmail(email: string): string {
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/g, '') // Only allow valid email characters
    .slice(0, 254); // Max email length per RFC
}

/**
 * Validate string length
 */
export function isWithinLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}
