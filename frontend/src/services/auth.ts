export async function login(
  usernameOrEmail: string,
  password: string,
): Promise<{ accessToken: string; username: string }> {
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

  return res.json();
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<{ accessToken: string; username: string }> {
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

  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  return res.json();
}

export function parseJwt(token: string) {
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
