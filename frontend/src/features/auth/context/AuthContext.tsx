import { createContext, useContext, useEffect, useEffectEvent, useState } from "react";

import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister,
  parseJwt,
} from "../../../features/auth";
import type { User } from "../../../types";

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

  const handleLogoutState = useEffectEvent(() => {
    setAccessTokenState(undefined);
    setUser(undefined);
    localStorage.removeItem("username");
  });

  const checkAuth = useEffectEvent(async () => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      handleLogoutState();
      setLoading(false);
      return;
    }

    try {
      const data = await apiRefreshToken();
      handleAuthSuccess(data.accessToken, storedUsername);
    } catch {
      handleLogoutState();
    }
    setLoading(false);
  });

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
    }
    handleLogoutState();
  };

  useEffect(() => {
    const handleLogout = () => handleLogoutState();
    const handleTokenUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | undefined>;
      setAccessTokenState(customEvent.detail);
    };

    queueMicrotask(() => {
      void checkAuth();
    });

    window.addEventListener("auth-logout", handleLogout);
    window.addEventListener("auth-token-update", handleTokenUpdate);

    return () => {
      window.removeEventListener("auth-logout", handleLogout);
      window.removeEventListener("auth-token-update", handleTokenUpdate);
    };
  }, []);

  const contextValue: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
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
