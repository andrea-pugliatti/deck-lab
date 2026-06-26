import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken } from "../services/api";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister,
  parseJwt,
} from "../services/auth";
import type { User } from "../types";

interface AuthContextType {
  user?: User;
  accessToken?: string;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessTokenState] = useState<string>();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!accessToken;

  const handleAuthSuccess = (token: string, username: string) => {
    setAccessToken(token);
    setAccessTokenState(token);
    const decoded = parseJwt(token);
    const email = decoded?.sub || "";
    setUser({ username, email });
    localStorage.setItem("username", username);
  };

  const handleLogoutState = () => {
    setAccessToken(undefined);
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
    checkAuth();
    window.addEventListener("auth-logout", handleLogoutState);
    return () => {
      window.removeEventListener("auth-logout", handleLogoutState);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
