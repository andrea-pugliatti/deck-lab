/**
 * Calculates the number of combinations of n items taken k at a time (n choose k).
 *
 * @param n Total number of items
 * @param k Number of items to choose
 * @returns The number of possible combinations
 */
export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return res;
}

/**
 * Calculates the probability of drawing exactly x successes in a sample of size n,
 * from a population of size N containing exactly K successes.
 *
 * @param x Number of successes in the sample
 * @param N Total population size
 * @param K Total number of successes in population
 * @param n Sample size (number of draws)
 * @returns The probability of drawing exactly x successes
 */
export function hypergeometric(x: number, N: number, K: number, n: number): number {
  const numerator = choose(K, x) * choose(N - K, n - x);
  const denominator = choose(N, n);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculates the cumulative probability of drawing at least a certain number of successes
 * in a sample of size n, from a population of size N containing exactly K successes.
 *
 * @param N Total population size (e.g. Main Deck count)
 * @param K Total number of successes in population (e.g. number of copies of a card in the deck)
 * @param n Sample size (e.g. starting hand size)
 * @param atLeast The minimum number of successes desired in the sample
 * @returns The probability of drawing at least `atLeast` successes
 */
export function calculateProbability(N: number, K: number, n: number, atLeast: number): number {
  if (N <= 0 || n <= 0 || K <= 0 || K < atLeast) return 0;
  if (N < n) return 1.0;
  let sum = 0;
  const maxPossible = Math.min(K, n);
  for (let i = atLeast; i <= maxPossible; i++) {
    sum += hypergeometric(i, N, K, n);
  }
  return sum;
}
