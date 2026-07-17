import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/theme.dart';

/// Skeleton loader using shimmer gradients.
class ShimmerPlaceholder extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ShimmerPlaceholder({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: DeckLabTheme.darkSurface,
      highlightColor: DeckLabTheme.darkSurfaceElevated,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: DeckLabTheme.darkSurface,
          borderRadius: .circular(borderRadius),
        ),
      ),
    );
  }
}
