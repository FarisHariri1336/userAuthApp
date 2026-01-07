/**
 * Core auth data types
 */

export type User = {
  id: string; // UUID
  name: string;
  email: string; // Normalized (trim + lowercase)
  passwordHash: string;
  createdAt: string; // ISO timestamp
};

export type Session = {
  userId: string;
  createdAt: string; // ISO timestamp
};

/**
 * Signup credentials
 */
export type SignupCredentials = {
  name: string;
  email: string;
  password: string;
};

/**
 * Login credentials
 */
export type LoginCredentials = {
  email: string;
  password: string;
};
