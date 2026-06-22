let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...options.headers,
  } as Record<string, string>;

  // Ensure cookies are sent (HttpOnly refresh token)
  options.credentials = "same-origin";

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (options.body && !headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  options.headers = headers;

  const response = await fetch(url, options);

  if (response.status === 401) {
    if (url === "/api/auth/refresh") {
      setAccessToken(null);
      throw new Error("Refresh token expired or invalid");
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          const newAccessToken = data.accessToken;
          setAccessToken(newAccessToken);
          isRefreshing = false;
          onRefreshed(newAccessToken);
        } else {
          isRefreshing = false;
          setAccessToken(null);
          refreshSubscribers = [];
          window.dispatchEvent(new CustomEvent("auth-logout"));
          throw new Error("Session expired");
        }
      } catch (error) {
        isRefreshing = false;
        setAccessToken(null);
        refreshSubscribers = [];
        window.dispatchEvent(new CustomEvent("auth-logout"));
        throw error;
      }
    }

    return new Promise<Response>((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        } as Record<string, string>;
        options.headers = retryHeaders;
        fetch(url, options).then(resolve).catch(reject);
      });
    });
  }

  return response;
}
