import { apiFetch } from "./api";

/**
 * Authenticates a user by username or email and retrieves the JWT tokens.
 *
 * @param usernameOrEmail - The user's username or email address.
 * @param password - The user's password.
 * @returns A promise resolving to the token payload containing access token and username.
 * @throws {Error} If credentials are invalid or rate limits are exceeded.
 */
export async function login(
  usernameOrEmail: string,
  password: string,
): Promise<{ accessToken: string; username: string }> {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: usernameOrEmail, password }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Too many login attempts. Please try again later.");
    }
    throw new Error("Invalid username or password");
  }

  return res.json() as Promise<{ accessToken: string; username: string }>;
}

/**
 * Registers a new user account.
 *
 * @param username - The desired unique username.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise resolving to the registered user's payload.
 * @throws {Error} If registration fails.
 */
export async function register(
  username: string,
  email: string,
  password: string,
): Promise<{ accessToken: string; username: string }> {
  const res = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || "Registration failed");
  }

  return res.json() as Promise<{ accessToken: string; username: string }>;
}

/**
 * Revokes the session by posting to the logout endpoint.
 *
 * @returns A promise resolving when the logout completes successfully.
 * @throws {Error} If the server rejects the logout request.
 */
export async function logout(): Promise<void> {
  const res = await apiFetch("/api/auth/logout", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

/**
 * Sends a post request to refresh the current JWT access token using the HTTP-only cookie.
 *
 * @returns A promise resolving to the new access token payload.
 * @throws {Error} If the refresh operation fails.
 */
export async function refreshToken(): Promise<{ accessToken: string }> {
  const res = await apiFetch("/api/auth/refresh", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  return res.json() as Promise<{ accessToken: string }>;
}

/**
 * Decoded payload shape of a JWT token.
 */
export interface JwtPayload {
  subject?: string;
  [key: string]: unknown;
}

/**
 * Parses and decodes the payload of a JWT token string.
 * Safe helper that returns undefined if base64 decoding fails.
 *
 * @param token - The raw JWT token string.
 * @returns The parsed payload object, or undefined if invalid.
 */
export function parseJwt(token: string): JwtPayload | undefined {
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
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return undefined;
  }
}
