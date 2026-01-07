import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage wrapper around AsyncStorage for type-safe operations
 * Makes it easy to mock in tests and swap implementation if needed
 */
export class Storage {
  /**
   * Get item from storage and parse as JSON
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      const parsed = JSON.parse(value) as T;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  /**
   * Set item in storage as JSON string
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear all storage (use with caution)
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw error;
    }
  }
}
