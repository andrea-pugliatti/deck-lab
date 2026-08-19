import 'package:cached_network_image/cached_network_image.dart';
import 'package:material_ui/material_ui.dart';
import '../theme/theme.dart';
import 'shimmer_placeholder.dart';

/// A reusable network image widget backed by CachedNetworkImage with shimmer loading and error states.
class AppNetworkImage extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final double borderRadius;
  final Widget? placeholder;
  final Widget? errorWidget;
  final int? memCacheWidth;
  final int? memCacheHeight;

  const AppNetworkImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = .cover,
    this.borderRadius = 0,
    this.placeholder,
    this.errorWidget,
    this.memCacheWidth,
    this.memCacheHeight,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveRadius = BorderRadius.circular(borderRadius);

    if (imageUrl == null || imageUrl!.trim().isEmpty) {
      return _buildFallback(context, effectiveRadius);
    }

    final imageWidget = CachedNetworkImage(
      imageUrl: imageUrl!,
      width: width,
      height: height,
      fit: fit,
      memCacheWidth: memCacheWidth,
      memCacheHeight: memCacheHeight,
      placeholder: (context, url) =>
          placeholder ??
          ShimmerPlaceholder(
            width: width ?? .infinity,
            height: height ?? .infinity,
            borderRadius: borderRadius,
          ),
      errorWidget: (context, url, error) =>
          errorWidget ?? _buildFallback(context, effectiveRadius),
    );

    if (borderRadius > 0) {
      return ClipRRect(borderRadius: effectiveRadius, child: imageWidget);
    }

    return imageWidget;
  }

  Widget _buildFallback(BuildContext context, BorderRadius radius) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: DeckLabTheme.darkSurfaceElevated,
        borderRadius: radius,
      ),
      child: Center(
        child: Icon(
          Icons.broken_image_outlined,
          color: DeckLabTheme.mutedFg,
          size: (width != null && height != null)
              ? (width! < height! ? width! * 0.4 : height! * 0.4).clamp(
                  16.0,
                  48.0,
                )
              : 24.0,
        ),
      ),
    );
  }
}
