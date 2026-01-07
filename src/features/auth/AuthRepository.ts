import { Storage } from "../../shared/storage/storage";
import { User, Session } from "./types";

/**
 * Storage keys (versioned for future migrations)
 */
const STORAGE_KEYS = {
  USERS: "AUTH_USERS_V1",
  SESSION: "AUTH_SESSION_V1",
} as const;

/**
 * Repository layer for auth data persistence
 * Abstracts storage operations for users and sessions
 */
export class AuthRepository {
  /**
   * Get all registered users
   */
  static async getUsers(): Promise<User[]> {
    const users = await Storage.getItem<User[]>(STORAGE_KEYS.USERS);
    return users ?? [];
  }

  /**
   * Save all users to storage
   */
  static async saveUsers(users: User[]): Promise<void> {
    await Storage.setItem(STORAGE_KEYS.USERS, users);
  }

  /**
   * Find a user by email (normalized)
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    const user = users.find((u) => u.email === email) ?? null;
    return user;
  }

  /**
   * Find a user by ID
   */
  static async findUserById(userId: string): Promise<User | null> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId) ?? null;
    return user;
  }

  /**
   * Add a new user to storage
   */
  static async addUser(user: User): Promise<void> {
    const users = await this.getUsers();
    users.push(user);
    await this.saveUsers(users);
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<Session | null> {
    const session = await Storage.getItem<Session>(STORAGE_KEYS.SESSION);
    return session;
  }

  /**
   * Save session to storage
   */
  static async saveSession(session: Session): Promise<void> {
    await Storage.setItem(STORAGE_KEYS.SESSION, session);
  }

  /**
   * Clear current session
   */
  static async clearSession(): Promise<void> {
    await Storage.removeItem(STORAGE_KEYS.SESSION);
  }
}
