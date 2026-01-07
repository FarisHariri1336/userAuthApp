import * as ExpoCrypto from 'expo-crypto';

/**
 * Crypto wrapper for password hashing
 * Uses SHA-256 for hashing (suitable for this local-only app)
 *
 * Note: For production with backend, use salted hashes (bcrypt/argon2) server-side
 */
export class Crypto {
  /**
   * Hash a password using SHA-256
   */
  static async hash(password: string): Promise<string> {
    try {
      const hash = await ExpoCrypto.digestStringAsync(
        ExpoCrypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      return hash;
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against a hash
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    try {
      const passwordHash = await this.hash(password);
      const isMatch = passwordHash === hash;
      return isMatch;
    } catch (error) {
      return false;
    }
  }
}
