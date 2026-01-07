import { Crypto } from '../../shared/crypto/crypto';
import { AuthRepository } from './AuthRepository';
import { User, Session, SignupCredentials, LoginCredentials } from './types';
import { AuthError } from './errors';
import { required, isValidEmail, isStrongEnoughPassword, normalizeEmail } from './validators';
import { sanitizeName, sanitizeEmail, isWithinLength } from './sanitizers';
import { generateUUID, getCurrentTimestamp } from './utils';

/**
 * Business logic layer for authentication
 * Contains all auth operations: signup, login, logout, bootstrap
 */
export class AuthService {
  /**
   * Sign up a new user
   * Validates credentials, checks for duplicates, hashes password, creates user and session
   */
  static async signup(credentials: SignupCredentials): Promise<User> {
    const { name, email, password } = credentials;

    // Validate required fields
    if (!required(name) || !required(email) || !required(password)) {
      throw new AuthError('MISSING_FIELDS', 'All fields are required');
    }

    // Sanitize inputs
    const sanitizedName = sanitizeName(name);
    const sanitizedEmail = sanitizeEmail(email);

    // Validate name length
    if (!isWithinLength(sanitizedName, 1, 100)) {
      throw new AuthError('INVALID_EMAIL', 'Name must be between 1 and 100 characters');
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      throw new AuthError('INVALID_EMAIL', 'Invalid email format');
    }

    // Validate password strength
    if (!isStrongEnoughPassword(password)) {
      throw new AuthError('WEAK_PASSWORD', 'Password must be at least 6 characters');
    }

    // Normalize email for consistent lookups
    const normalizedEmail = normalizeEmail(sanitizedEmail);

    // Check if email already exists
    const existingUser = await AuthRepository.findUserByEmail(normalizedEmail);
    if (existingUser) {
      throw new AuthError('EMAIL_ALREADY_EXISTS', 'Email already registered');
    }

    // Hash password
    const passwordHash = await Crypto.hash(password);

    // Create new user
    const user: User = {
      id: generateUUID(),
      name: sanitizedName,
      email: normalizedEmail,
      passwordHash,
      createdAt: getCurrentTimestamp(),
    };

    // Save user
    try {
      await AuthRepository.addUser(user);
    } catch (error) {
      throw new AuthError('STORAGE_ERROR', 'Failed to save user');
    }

    // Create and save session
    const session: Session = {
      userId: user.id,
      createdAt: getCurrentTimestamp(),
    };

    try {
      await AuthRepository.saveSession(session);
    } catch (error) {
      throw new AuthError('STORAGE_ERROR', 'Failed to save session');
    }

    return user;
  }

  /**
   * Login an existing user
   * Validates credentials, verifies password hash, creates session
   */
  static async login(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;

    // Validate required fields
    if (!required(email) || !required(password)) {
      throw new AuthError('MISSING_FIELDS', 'Email and password are required');
    }

    // Sanitize email input
    const sanitizedEmail = sanitizeEmail(email);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      throw new AuthError('INVALID_EMAIL', 'Invalid email format');
    }

    // Normalize email
    const normalizedEmail = normalizeEmail(sanitizedEmail);

    // Find user by email
    const user = await AuthRepository.findUserByEmail(normalizedEmail);
    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await Crypto.verify(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Create and save session
    const session: Session = {
      userId: user.id,
      createdAt: getCurrentTimestamp(),
    };

    try {
      await AuthRepository.saveSession(session);
    } catch (error) {
      throw new AuthError('STORAGE_ERROR', 'Failed to save session');
    }

    return user;
  }

  /**
   * Logout current user
   * Clears session from storage
   */
  static async logout(): Promise<void> {
    try {
      await AuthRepository.clearSession();
    } catch (error) {
      throw new AuthError('STORAGE_ERROR', 'Failed to clear session');
    }
  }

  /**
   * Bootstrap auth state on app launch
   * Loads session and corresponding user for auto-login
   * Returns null if no valid session exists
   */
  static async bootstrap(): Promise<User | null> {
    try {
      // Load session
      const session = await AuthRepository.getSession();
      if (!session) {
        return null;
      }

      // Load user by session userId
      const user = await AuthRepository.findUserById(session.userId);
      if (!user) {
        // Session exists but user not found - clear invalid session
        await AuthRepository.clearSession();
        return null;
      }

      return user;
    } catch (error) {
      // Clear session on any error
      await AuthRepository.clearSession().catch(() => {});
      return null;
    }
  }
}
