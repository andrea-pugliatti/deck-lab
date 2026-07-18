import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../domain/models/deck_summary.dart';
import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';

class DeckItemCard extends StatelessWidget {
  final DeckSummary deck;

  const DeckItemCard({super.key, required this.deck});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Card(
      color: DeckLabTheme.darkSurface,
      margin: const .only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: .circular(16),
        side: const BorderSide(color: DeckLabTheme.borderDim),
      ),
      child: InkWell(
        onTap: () => context.push(AppRoutes.deckDetail(deck.id)),
        borderRadius: .circular(16),
        child: Padding(
          padding: const .all(20.0),
          child: Column(
            crossAxisAlignment: .start,
            children: [
              // Header formats
              Row(
                mainAxisAlignment: .spaceBetween,
                children: [
                  Container(
                    padding: const .symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: DeckLabTheme.goldAccent.withValues(alpha: 0.1),
                      border: .all(
                        color: DeckLabTheme.goldAccent.withValues(alpha: 0.2),
                      ),
                      borderRadius: .circular(6),
                    ),
                    child: Text(
                      deck.formatName.toUpperCase(),
                      style: tt.labelSmall!.copyWith(
                        color: cs.primary,
                        fontWeight: .bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  Flexible(
                    child: Text(
                      'by ${deck.creatorUsername ?? "Anonymous"}',
                      overflow: .ellipsis,
                      style: tt.bodySmall!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.38),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Title
              Text(
                deck.name.toUpperCase(),
                style: tt.titleLarge!.copyWith(
                  fontSize: 16,
                  color: cs.onSurface,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 6),

              // Subtitle
              if (deck.description != null && deck.description!.isNotEmpty)
                Text(
                  deck.description!,
                  maxLines: 2,
                  overflow: .ellipsis,
                  style: tt.bodySmall!.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.7),
                    height: 1.4,
                  ),
                )
              else
                Text(
                  'No description strategies provided.',
                  style: tt.bodySmall!.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.3),
                    fontStyle: .italic,
                  ),
                ),
              const SizedBox(height: 16),

              // Divider
              const Divider(height: 1),
              const SizedBox(height: 12),

              // Meta counts
              Row(
                mainAxisAlignment: .spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.layers, size: 14, color: cs.secondary),
                      const SizedBox(width: 6),
                      Text(
                        '${deck.totalCardsCount} Cards',
                        style: tt.labelMedium!.copyWith(
                          color: cs.secondary,
                          fontWeight: .bold,
                        ),
                      ),
                    ],
                  ),
                  if (deck.updatedAt != null)
                    Text(
                      _formatDate(deck.updatedAt!),
                      style: tt.bodySmall!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.38),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(String isoString) {
    try {
      final date = DateTime.parse(isoString);
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return '';
    }
  }
}
