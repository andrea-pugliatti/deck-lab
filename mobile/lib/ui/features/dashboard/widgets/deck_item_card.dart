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
                      style: const TextStyle(
                        color: DeckLabTheme.goldAccent,
                        fontSize: 10,
                        fontWeight: .bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  Flexible(
                    child: Text(
                      'by ${deck.creatorUsername ?? "Anonymous"}',
                      overflow: .ellipsis,
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Title
              Text(
                deck.name.toUpperCase(),
                style: const TextStyle(
                  fontFamily: 'Cinzel',
                  fontSize: 16,
                  fontWeight: .bold,
                  color: Colors.white,
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
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    height: 1.4,
                  ),
                )
              else
                const Text(
                  'No description strategies provided.',
                  style: TextStyle(
                    color: Colors.white30,
                    fontSize: 13,
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
                      const Icon(
                        Icons.layers,
                        size: 14,
                        color: DeckLabTheme.cyanAccent,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${deck.totalCardsCount} Cards',
                        style: const TextStyle(
                          color: DeckLabTheme.cyanAccent,
                          fontWeight: .bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  if (deck.updatedAt != null)
                    Text(
                      _formatDate(deck.updatedAt!),
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 11,
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
