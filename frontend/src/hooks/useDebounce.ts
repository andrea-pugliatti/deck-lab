import { useEffect, useState } from "react";

/**
 * Custom React hook that debounces a fast-changing state value.
 * Delays updating the returned value until the specified delay has passed.
 *
 * @template T - The type of value being debounced.
 * @param value - The value to debounce.
 * @param delay - The delay duration in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
