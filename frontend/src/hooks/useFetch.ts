import { useCallback, useEffect, useRef, useState } from "react";

import { apiFetch, parseResponseError } from "../services/api";

export interface FetchOptions extends RequestInit {
  skip?: boolean;
}

export function useFetch<T = unknown>(url?: string, options?: FetchOptions) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(!options?.skip && !!url);
  const [error, setError] = useState<Error>();

  const [prevUrl, setPrevUrl] = useState<string | undefined>(url);
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
      setError(undefined);

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

        let responseData: T | undefined = undefined;
        if (response.status !== 204) {
          responseData = (await response.json()) as T;
        }
        setData(responseData);
        return responseData;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Fetch was aborted, ignore setting error/loading state
          return;
        }
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(undefined);
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
