/**
 * @file api.ts
 * @description Core API client utility providing token-based authentication headers,
 * automatic token refreshing using cookies, queueing of failed requests during refresh,
 * and unified response error parsing.
 */

/** Current JWT access token stored in memory. */
let accessToken: string | undefined = undefined;

/** Flag indicating if an access token refresh operation is currently in progress. */
let isRefreshing = false;

/** Subscriber queue for requests waiting for the token refresh to complete. */
let refreshSubscribers: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

/**
 * Retrieves the currently active in-memory access token.
 *
 * @returns The active JWT access token, or undefined if not authenticated.
 */
export function getAccessToken(): string | undefined {
  return accessToken;
}

/**
 * Sets the active in-memory access token.
 *
 * @param token - The new JWT access token, or undefined to clear.
 */
export function setAccessToken(token?: string): void {
  accessToken = token;
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("auth-token-update", { detail: token }));
  }
}

/**
 * Helper to check if a URL is an authentication endpoint.
 */
function isAuthUrl(url: string): boolean {
  return (
    url.endsWith("/api/auth/login") ||
    url.endsWith("/api/auth/register") ||
    url.endsWith("/api/auth/logout") ||
    url.endsWith("/api/auth/refresh")
  );
}

/**
 * Enqueues a promise resolution callback to be called once the access token
 * is successfully refreshed.
 *
 * @param resolve - Callback to execute on successful refresh.
 * @param reject - Callback to execute if refresh fails.
 */
function subscribeTokenRefresh(resolve: (token: string) => void, reject: (err: unknown) => void) {
  refreshSubscribers.push({ resolve, reject });
}

/**
 * Flushes the subscription queue with the newly retrieved token, resolving all queued promises.
 *
 * @param token - The refreshed access token.
 */
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb.resolve(token));
  refreshSubscribers = [];
}

/**
 * Flushes the subscription queue with an error, rejecting all queued promises.
 *
 * @param err - The refresh failure error.
 */
function onRefreshFailed(err: unknown) {
  refreshSubscribers.forEach((cb) => cb.reject(err));
  refreshSubscribers = [];
}

/**
 * Parses validation errors or generic error messages returned in a JSON payload
 * or raw text format from the server.
 *
 * @param response - The Fetch API Response object containing errors.
 * @returns A promise resolving to an array of error messages.
 */
export async function parseResponseErrors(response: Response): Promise<string[]> {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errData = (await response.json()) as
        | {
            errors?: unknown[];
            message?: string;
            error?: string;
          }
        | null
        | undefined;
      if (errData) {
        if (Array.isArray(errData.errors)) {
          return errData.errors.map((e: unknown) => {
            if (typeof e === "string") return e;
            if (e && typeof e === "object") {
              const errObj = e as Record<string, unknown>;
              const msg = errObj.defaultMessage || errObj.message || errObj.error;
              if (typeof msg === "string") return msg;
            }
            return String(e || "Unknown validation error");
          });
        } else if (errData.message) {
          return [errData.message];
        } else if (errData.error) {
          return [errData.error];
        }
      }
    } else {
      const errText = await response.text();
      if (errText) return [errText];
    }
  } catch {
    // ignore parsing errors
  }
  return [`Error: ${response.status} ${response.statusText}`];
}

/**
 * Parses response errors and packages them into a standard JavaScript Error object.
 *
 * @param response - The Fetch API Response object.
 * @returns A promise resolving to an Error object containing concatenated error details.
 */
export async function parseResponseError(response: Response): Promise<Error> {
  const errorsList = await parseResponseErrors(response);
  return new Error(errorsList.join(", "));
}

/**
 * Custom fetch wrapper that automatically appends the Bearer token, sets correct
 * Content-Type headers, sets credentials options to 'same-origin', and handles 401 token refresh.
 *
 * If a 401 Unauthorized occurs, it attempts to refresh the access token once.
 * Other requests triggered during the refresh are queued and retried automatically.
 *
 * @param url - The resource URL to fetch.
 * @param options - Standard RequestInit options.
 * @returns A promise resolving to the Fetch API Response object.
 * @throws {Error} If refreshing the token fails or session expires.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";
  const targetUrl = url.startsWith("/api") ? `${apiBaseUrl}${url}` : url;
  console.log(`[apiFetch] url: ${url} -> targetUrl: ${targetUrl} (base: ${apiBaseUrl})`);

  const headers = {
    ...options.headers,
  } as Record<string, string>;

  // Ensure cookies are sent (HttpOnly refresh token)
  options.credentials = "include";

  if (accessToken && !isAuthUrl(url)) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (options.body && !headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  options.headers = headers;

  const response = await fetch(targetUrl, options);

  const isLogin = url.endsWith("/api/auth/login");
  const isRegister = url.endsWith("/api/auth/register");
  const isRefresh = url.endsWith("/api/auth/refresh");
  const isLogout = url.endsWith("/api/auth/logout");

  // If logout request, clear local token state anyway
  if (isLogout) {
    setAccessToken(undefined);
  }

  if (response.ok && (isLogin || isRegister || isRefresh)) {
    try {
      const cloned = typeof response.clone === "function" ? response.clone() : response;
      const data = (await cloned.json()) as { accessToken?: string };
      if (data && data.accessToken) {
        setAccessToken(data.accessToken);
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }

  if (response.status === 401) {
    if (isRefresh) {
      setAccessToken(undefined);
      throw new Error("Refresh token expired or invalid");
    }

    if (isAuthUrl(url)) {
      return response;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      apiFetch("/api/auth/refresh", {
        method: "POST",
      })
        .then(async (refreshRes) => {
          if (refreshRes.ok) {
            // accessToken is updated by the interceptor during the successful apiFetch refresh call.
            isRefreshing = false;
            onRefreshed(accessToken || "");
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
          const retryOptions = {
            ...options,
            headers: retryHeaders,
          };
          fetch(targetUrl, retryOptions).then(resolve).catch(reject);
        },
        (err) => {
          reject(err);
        },
      );
    });
  }

  return response;
}
