import 'dart:math';

/// Domain service wrapping hypergeometric probability equations.
class HypergeometricCalculator {
  // Prevent instantiation
  HypergeometricCalculator._();

  /// Calculates the cumulative probability of drawing at least one success copy.
  ///
  /// * [populationSize] (N): total cards count in the deck.
  /// * [successCopies] (K): number of copies of the target card in the deck.
  /// * [sampleSize] (n): draw size count (typically 5 or 6).
  ///
  /// Formula: P(X >= 1) = 1 - [ C(N-K, n) / C(N, n) ]
  static double calculateProbability({
    required int populationSize,
    required int successCopies,
    required int sampleSize,
  }) {
    final N = populationSize;
    final K = successCopies;
    final n = min(sampleSize, N);

    if (N <= 0 || K <= 0 || sampleSize <= 0 || K > N) {
      return 0.0;
    }

    final combinationNoTargets = _combination(N - K, n);
    final combinationTotal = _combination(N, n);

    if (combinationTotal > 0.0) {
      return 1.0 - (combinationNoTargets / combinationTotal);
    }
    return 0.0;
  }

  /// Calculates binomial combination coefficients C(n, r).
  static double _combination(int n, int r) {
    if (r < 0 || r > n) return 0.0;
    if (r == 0 || r == n) return 1.0;

    double result = 1.0;
    final k = r < n - r ? r : n - r;
    for (int i = 1; i <= k; i++) {
      result = result * (n - k + i) / i;
    }
    return result;
  }
}
