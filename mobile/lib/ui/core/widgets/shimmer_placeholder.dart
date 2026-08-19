import 'dart:io';
import 'package:material_ui/material_ui.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/theme.dart';

/// Skeleton loader using shimmer gradients.
class ShimmerPlaceholder extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;
  final bool? enabled;

  const ShimmerPlaceholder({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 8,
    this.enabled,
  });

  bool get _shouldAnimate {
    if (enabled != null) return enabled!;
    try {
      return !Platform.environment.containsKey('FLUTTER_TEST');
    } catch (_) {
      return true;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: DeckLabTheme.darkSurface,
      highlightColor: DeckLabTheme.darkSurfaceElevated,
      enabled: _shouldAnimate,
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
