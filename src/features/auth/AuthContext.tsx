import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { AuthService } from './AuthService';
import { User, SignupCredentials, LoginCredentials } from './types';

/**
 * Auth context value type
 */
type AuthContextValue = {
  user: User | null;
  isBootstrapping: boolean;
  signup: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

/**
 * Create context with undefined default (will be provided by AuthProvider)
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth provider props
 */
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * AuthProvider component
 * Manages auth state and provides actions to children
 * Handles bootstrap (auto-login) on mount
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  /**
   * Bootstrap on mount - load persisted session
   */
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const bootstrappedUser = await AuthService.bootstrap();
        if (!cancelled) {
          setUser(bootstrappedUser);
        }
      } catch (error) {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Sign up a new user
   */
  const signup = useCallback(async (credentials: SignupCredentials) => {
    const newUser = await AuthService.signup(credentials);
    setUser(newUser);
  }, []);

  /**
   * Login existing user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    const loggedInUser = await AuthService.login(credentials);
    setUser(loggedInUser);
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isBootstrapping,
    signup,
    login,
    logout,
  }), [user, isBootstrapping, signup, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
