let accessToken: string | undefined = undefined;
let isRefreshing = false;
let refreshSubscribers: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

export function getAccessToken(): string | undefined {
  return accessToken;
}

export function setAccessToken(token?: string): void {
  accessToken = token;
}

function subscribeTokenRefresh(resolve: (token: string) => void, reject: (err: any) => void) {
  refreshSubscribers.push({ resolve, reject });
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb.resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(err: any) {
  refreshSubscribers.forEach((cb) => cb.reject(err));
  refreshSubscribers = [];
}

export async function parseResponseError(response: Response): Promise<Error> {
  let errorMessage = `Error: ${response.status} ${response.statusText}`;
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errData = await response.json();
      if (errData) {
        if (Array.isArray(errData.errors)) {
          const errorsList = errData.errors.map((e: any) => {
            if (typeof e === "string") return e;
            if (!e) return "Unknown validation error";
            return e.defaultMessage || e.message || e.error || String(e);
          });
          if (errorsList.length > 0) {
            errorMessage = errorsList.join(", ");
          }
        } else if (errData.message) {
          errorMessage = errData.message;
        } else if (errData.error) {
          errorMessage = errData.error;
        }
      }
    } else {
      const errText = await response.text();
      if (errText) errorMessage = errText;
    }
  } catch {
    // ignore parsing errors and use status message
  }
  return new Error(errorMessage);
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
      setAccessToken(undefined);
      throw new Error("Refresh token expired or invalid");
    }

    if (!isRefreshing) {
      isRefreshing = true;
      fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (refreshRes) => {
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAccessToken = data.accessToken;
            setAccessToken(newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);
          } else {
            const err = new Error("Session expired");
            isRefreshing = false;
            setAccessToken(undefined);
            onRefreshFailed(err);
            window.dispatchEvent(new CustomEvent("auth-logout"));
          }
        })
        .catch((error) => {
          isRefreshing = false;
          setAccessToken(undefined);
          onRefreshFailed(error);
          window.dispatchEvent(new CustomEvent("auth-logout"));
        });
    }

    return new Promise<Response>((resolve, reject) => {
      subscribeTokenRefresh(
        (newToken) => {
          const retryHeaders = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          } as Record<string, string>;
          options.headers = retryHeaders;
          fetch(url, options).then(resolve).catch(reject);
        },
        (err) => {
          reject(err);
        },
      );
    });
  }

  return response;
}
