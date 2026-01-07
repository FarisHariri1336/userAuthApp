import {
  required,
  isValidEmail,
  isStrongEnoughPassword,
  normalizeEmail,
} from '../features/auth/validators';

describe('Validators', () => {
  describe('required', () => {
    it('returns true for non-empty strings', () => {
      expect(required('hello')).toBe(true);
      expect(required('test@example.com')).toBe(true);
    });

    it('returns false for empty strings', () => {
      expect(required('')).toBe(false);
    });

    it('returns false for whitespace-only strings', () => {
      expect(required('   ')).toBe(false);
      expect(required('\t')).toBe(false);
      expect(required('\n')).toBe(false);
    });

    it('returns true for strings with leading/trailing whitespace', () => {
      expect(required('  hello  ')).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('returns false for invalid email formats', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('returns false for whitespace-only strings', () => {
      expect(isValidEmail('   ')).toBe(false);
    });
  });

  describe('isStrongEnoughPassword', () => {
    it('returns true for passwords with 6 or more characters', () => {
      expect(isStrongEnoughPassword('123456')).toBe(true);
      expect(isStrongEnoughPassword('password')).toBe(true);
      expect(isStrongEnoughPassword('verylongpassword')).toBe(true);
    });

    it('returns false for passwords with less than 6 characters', () => {
      expect(isStrongEnoughPassword('12345')).toBe(false);
      expect(isStrongEnoughPassword('abc')).toBe(false);
      expect(isStrongEnoughPassword('a')).toBe(false);
      expect(isStrongEnoughPassword('')).toBe(false);
    });

    it('returns true for exactly 6 characters', () => {
      expect(isStrongEnoughPassword('abcdef')).toBe(true);
    });
  });

  describe('normalizeEmail', () => {
    it('converts email to lowercase', () => {
      expect(normalizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
      expect(normalizeEmail('Test@Example.Com')).toBe('test@example.com');
    });

    it('trims whitespace', () => {
      expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
      expect(normalizeEmail('\tuser@example.com\n')).toBe('user@example.com');
    });

    it('handles combined transformations', () => {
      expect(normalizeEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
    });

    it('preserves valid email format', () => {
      expect(normalizeEmail('user+tag@example.com')).toBe('user+tag@example.com');
    });
  });
});
