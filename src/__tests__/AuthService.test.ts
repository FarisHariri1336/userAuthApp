import { AuthService } from "../features/auth/AuthService";
import { AuthRepository } from "../features/auth/AuthRepository";
import { Crypto } from "../shared/crypto/crypto";
import { AuthError } from "../features/auth/errors";
import { User, Session } from "../features/auth/types";

// Mock dependencies
jest.mock("../features/auth/AuthRepository");
jest.mock("../shared/crypto/crypto");

const MockedAuthRepository = AuthRepository as jest.Mocked<
  typeof AuthRepository
>;
const MockedCrypto = Crypto as jest.Mocked<typeof Crypto>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("creates a new user and session successfully", async () => {
      MockedAuthRepository.findUserByEmail.mockResolvedValue(null);
      MockedCrypto.hash.mockResolvedValue("hashed_password");
      MockedAuthRepository.addUser.mockResolvedValue();
      MockedAuthRepository.saveSession.mockResolvedValue();

      const credentials = {
        name: "John Cena",
        email: "john@example.com",
        password: "password123",
      };

      const user = await AuthService.signup(credentials);

      expect(user.name).toBe("John Cena");
      expect(user.email).toBe("john@example.com");
      expect(user.passwordHash).toBe("hashed_password");
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();

      expect(MockedCrypto.hash).toHaveBeenCalledWith("password123");
      expect(MockedAuthRepository.addUser).toHaveBeenCalledWith(user);
      expect(MockedAuthRepository.saveSession).toHaveBeenCalled();
    });

    it("normalizes email to lowercase", async () => {
      MockedAuthRepository.findUserByEmail.mockResolvedValue(null);
      MockedCrypto.hash.mockResolvedValue("hashed_password");
      MockedAuthRepository.addUser.mockResolvedValue();
      MockedAuthRepository.saveSession.mockResolvedValue();

      const credentials = {
        name: "John Cena",
        email: "JOHN@EXAMPLE.COM",
        password: "password123",
      };

      const user = await AuthService.signup(credentials);

      expect(user.email).toBe("john@example.com");
      expect(MockedAuthRepository.findUserByEmail).toHaveBeenCalledWith(
        "john@example.com"
      );
    });

    it("throws MISSING_FIELDS error when name is missing", async () => {
      const credentials = {
        name: "",
        email: "john@example.com",
        password: "password123",
      };

      await expect(AuthService.signup(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.signup(credentials)).rejects.toMatchObject({
        code: "MISSING_FIELDS",
      });
    });

    it("throws MISSING_FIELDS error when email is missing", async () => {
      const credentials = {
        name: "John Cena",
        email: "",
        password: "password123",
      };

      await expect(AuthService.signup(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.signup(credentials)).rejects.toMatchObject({
        code: "MISSING_FIELDS",
      });
    });

    it("throws INVALID_EMAIL error for invalid email format", async () => {
      const credentials = {
        name: "John Cena",
        email: "not-an-email",
        password: "password123",
      };

      await expect(AuthService.signup(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.signup(credentials)).rejects.toMatchObject({
        code: "INVALID_EMAIL",
      });
    });

    it("throws WEAK_PASSWORD error for short password", async () => {
      const credentials = {
        name: "John Cena",
        email: "john@example.com",
        password: "12345",
      };

      await expect(AuthService.signup(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.signup(credentials)).rejects.toMatchObject({
        code: "WEAK_PASSWORD",
      });
    });

    it("throws EMAIL_ALREADY_EXISTS error when email is taken", async () => {
      const existingUser: User = {
        id: "1",
        name: "Existing User",
        email: "john@example.com",
        passwordHash: "hash",
        createdAt: new Date().toISOString(),
      };

      MockedAuthRepository.findUserByEmail.mockResolvedValue(existingUser);

      const credentials = {
        name: "John Cena",
        email: "john@example.com",
        password: "password123",
      };

      await expect(AuthService.signup(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.signup(credentials)).rejects.toMatchObject({
        code: "EMAIL_ALREADY_EXISTS",
      });
    });
  });

  describe("login", () => {
    const mockUser: User = {
      id: "1",
      name: "John Cena",
      email: "john@example.com",
      passwordHash: "hashed_password",
      createdAt: new Date().toISOString(),
    };

    it("logs in successfully with valid credentials", async () => {
      MockedAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
      MockedCrypto.verify.mockResolvedValue(true);
      MockedAuthRepository.saveSession.mockResolvedValue();

      const credentials = {
        email: "john@example.com",
        password: "password123",
      };

      const user = await AuthService.login(credentials);

      expect(user).toEqual(mockUser);
      expect(MockedCrypto.verify).toHaveBeenCalledWith(
        "password123",
        "hashed_password"
      );
      expect(MockedAuthRepository.saveSession).toHaveBeenCalled();
    });

    it("throws MISSING_FIELDS error when email is missing", async () => {
      const credentials = {
        email: "",
        password: "password123",
      };

      await expect(AuthService.login(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.login(credentials)).rejects.toMatchObject({
        code: "MISSING_FIELDS",
      });
    });

    it("throws INVALID_EMAIL error for invalid email format", async () => {
      const credentials = {
        email: "not-an-email",
        password: "password123",
      };

      await expect(AuthService.login(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.login(credentials)).rejects.toMatchObject({
        code: "INVALID_EMAIL",
      });
    });

    it("throws INVALID_CREDENTIALS error when user not found", async () => {
      MockedAuthRepository.findUserByEmail.mockResolvedValue(null);

      const credentials = {
        email: "notfound@example.com",
        password: "password123",
      };

      await expect(AuthService.login(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.login(credentials)).rejects.toMatchObject({
        code: "INVALID_CREDENTIALS",
      });
    });

    it("throws INVALID_CREDENTIALS error when password is incorrect", async () => {
      MockedAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
      MockedCrypto.verify.mockResolvedValue(false);

      const credentials = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      await expect(AuthService.login(credentials)).rejects.toThrow(AuthError);
      await expect(AuthService.login(credentials)).rejects.toMatchObject({
        code: "INVALID_CREDENTIALS",
      });
    });
  });

  describe("logout", () => {
    it("clears session successfully", async () => {
      MockedAuthRepository.clearSession.mockResolvedValue();

      await AuthService.logout();

      expect(MockedAuthRepository.clearSession).toHaveBeenCalled();
    });

    it("throws STORAGE_ERROR when clearSession fails", async () => {
      MockedAuthRepository.clearSession.mockRejectedValue(
        new Error("Storage error")
      );

      await expect(AuthService.logout()).rejects.toThrow(AuthError);
      await expect(AuthService.logout()).rejects.toMatchObject({
        code: "STORAGE_ERROR",
      });
    });
  });

  describe("bootstrap", () => {
    const mockUser: User = {
      id: "1",
      name: "John Cena",
      email: "john@example.com",
      passwordHash: "hashed_password",
      createdAt: new Date().toISOString(),
    };

    const mockSession: Session = {
      userId: "1",
      createdAt: new Date().toISOString(),
    };

    it("returns user when valid session exists", async () => {
      MockedAuthRepository.getSession.mockResolvedValue(mockSession);
      MockedAuthRepository.findUserById.mockResolvedValue(mockUser);

      const user = await AuthService.bootstrap();

      expect(user).toEqual(mockUser);
      expect(MockedAuthRepository.getSession).toHaveBeenCalled();
      expect(MockedAuthRepository.findUserById).toHaveBeenCalledWith("1");
    });

    it("returns null when no session exists", async () => {
      MockedAuthRepository.getSession.mockResolvedValue(null);

      const user = await AuthService.bootstrap();

      expect(user).toBeNull();
      expect(MockedAuthRepository.findUserById).not.toHaveBeenCalled();
    });

    it("clears session and returns null when user not found", async () => {
      MockedAuthRepository.getSession.mockResolvedValue(mockSession);
      MockedAuthRepository.findUserById.mockResolvedValue(null);
      MockedAuthRepository.clearSession.mockResolvedValue();

      const user = await AuthService.bootstrap();

      expect(user).toBeNull();
      expect(MockedAuthRepository.clearSession).toHaveBeenCalled();
    });

    it("handles errors gracefully and returns null", async () => {
      MockedAuthRepository.getSession.mockRejectedValue(
        new Error("Storage error")
      );
      MockedAuthRepository.clearSession.mockResolvedValue();

      const user = await AuthService.bootstrap();

      expect(user).toBeNull();
    });
  });
});
