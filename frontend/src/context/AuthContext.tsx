import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { setAccessToken } from "../services/api";
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

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessTokenState] = useState<string>();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const storedUsername = localStorage.getItem("username") || "Duelist";
          handleAuthSuccess(data.accessToken, storedUsername);
        } else {
          handleLogoutState();
        }
      } catch {
        handleLogoutState();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleGlobalLogout = () => {
      handleLogoutState();
    };

    window.addEventListener("auth-logout", handleGlobalLogout);
    return () => {
      window.removeEventListener("auth-logout", handleGlobalLogout);
    };
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("Too many login attempts. Please try again later.");
      }
      throw new Error("Invalid username or password");
    }

    const data = await res.json();
    handleAuthSuccess(data.accessToken, data.username || usernameOrEmail);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || "Registration failed");
    }

    const data = await res.json();
    handleAuthSuccess(data.accessToken, data.username || username);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // Ignore logout request errors, clear local state anyway
    } finally {
      handleLogoutState();
    }
  };

  const isAuthenticated = !!accessToken;

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
