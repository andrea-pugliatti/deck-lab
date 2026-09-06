/**
 * @file validation.ts
 * @description Parameter and input validation utilities.
 */

/**
 * Checks whether a value is a a positive safe integer or a digit string parseable as such.
 *
 * @param value - The route parameter or raw value to validate.
 * @returns True if the value represents a valid positive safe integer.
 */
export function isValidNumericId(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0;
  }
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return false;
  const num = Number(trimmed);
  return Number.isSafeInteger(num) && num > 0;
}

/**
 * Parses and validates a dynamic route parameter or raw value as a positive safe integer.
 *
 * @param value - The route parameter or raw value to parse.
 * @returns The parsed positive integer, or undefined if invalid, non-numeric, or non-positive.
 */
export function parseNumericId(value: unknown): number | undefined {
  if (!isValidNumericId(value)) return undefined;
  return typeof value === "number" ? value : Number(value);
}
