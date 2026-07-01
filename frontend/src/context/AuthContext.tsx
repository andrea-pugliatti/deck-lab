import { createContext, useContext, useEffect, useState } from "react";

import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister,
  parseJwt,
} from "../services/auth";
import type { User } from "../types";

/**
 * Properties and authentication functions provided by the AuthContext.
 */
interface AuthContextType {
  user?: User;
  accessToken?: string;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Context container for authentication status.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the application routes to inject authentication states.
 * Automatically checks token status on mount and subscribes to auth logout trigger events.
 *
 * @param props - Children components.
 * @returns React Context Provider wrapping the children.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessTokenState] = useState<string>();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!accessToken;

  const handleAuthSuccess = (token: string, username: string) => {
    setAccessTokenState(token);
    const decoded = parseJwt(token);
    const email = decoded?.subject || "";
    setUser({ username, email });
    localStorage.setItem("username", username);
  };

  const handleLogoutState = () => {
    setAccessTokenState(undefined);
    setUser(undefined);
    localStorage.removeItem("username");
  };

  const checkAuth = async () => {
    try {
      const data = await apiRefreshToken();
      const storedUsername = localStorage.getItem("username") || "";
      handleAuthSuccess(data.accessToken, storedUsername);
    } catch {
      handleLogoutState();
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    const data = await apiLogin(usernameOrEmail, password);
    handleAuthSuccess(data.accessToken, data.username || usernameOrEmail);
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await apiRegister(username, email, password);
    handleAuthSuccess(data.accessToken, data.username || username);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore logout request errors, clear local state anyway
    } finally {
      handleLogoutState();
    }
  };

  useEffect(() => {
    const handleTokenUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | undefined>;
      setAccessTokenState(customEvent.detail);
    };

    Promise.resolve().then(() => {
      checkAuth();
    });

    window.addEventListener("auth-logout", handleLogoutState);
    window.addEventListener("auth-token-update", handleTokenUpdate);

    return () => {
      window.removeEventListener("auth-logout", handleLogoutState);
      window.removeEventListener("auth-token-update", handleTokenUpdate);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom React hook to consume authentication contexts from any downstream component.
 *
 * @returns The active AuthContext properties and handlers.
 * @throws {Error} If called outside of an AuthProvider scope.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
