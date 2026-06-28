import { useCallback, useEffect, useRef, useState } from "react";

import { apiFetch, parseResponseError } from "../services/api";

export interface FetchOptions extends RequestInit {
  skip?: boolean;
}

export function useFetch<T = any>(url: string | null, options?: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!options?.skip && !!url);
  const [error, setError] = useState<Error | null>(null);

  const [prevUrl, setPrevUrl] = useState<string | null>(url);
  const [prevSkip, setPrevSkip] = useState<boolean | undefined>(options?.skip);

  if (url !== prevUrl || options?.skip !== prevSkip) {
    setPrevUrl(url);
    setPrevSkip(options?.skip);
    setLoading(!options?.skip && !!url);
  }

  // Keep a stable ref to options to avoid dependency array issues on every render
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const execute = useCallback(
    async (abortSignal?: AbortSignal) => {
      if (!url) return;

      // Defer state updates to avoid synchronous setState inside useEffect
      await Promise.resolve();
      if (abortSignal?.aborted) return;

      setLoading(true);
      setError(null);

      try {
        const fetchOpts = { ...optionsRef.current };
        delete fetchOpts.skip;

        const response = await apiFetch(url, {
          ...fetchOpts,
          signal: abortSignal,
        });

        if (!response.ok) {
          throw await parseResponseError(response);
        }

        let responseData: any = null;
        if (response.status !== 204) {
          responseData = await response.json();
        }
        setData(responseData);
        return responseData;
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Fetch was aborted, ignore setting error/loading state
          return;
        }
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  useEffect(() => {
    if (options?.skip || !url) {
      return;
    }

    const abortController = new AbortController();

    Promise.resolve().then(() => {
      execute(abortController.signal).catch((_err) => {
        // Errors are already handled and set in state inside execute
      });
    });

    return () => {
      abortController.abort();
    };
  }, [url, options?.skip, execute]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return { data, loading, error, refetch };
}
