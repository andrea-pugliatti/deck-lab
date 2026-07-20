import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/navigation/routes.dart';

import '../../../core/theme/theme.dart';

class DeckSection extends StatelessWidget {
  final String title;
  final List<DeckCard> cards;
  final int count;
  final Color indicatorColor;

  const DeckSection({
    super.key,
    required this.title,
    required this.cards,
    required this.count,
    required this.indicatorColor,
  });

  @override
  Widget build(BuildContext context) {
    if (cards.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: .start,
      children: [
        Padding(
          padding: const .only(left: 20.0, right: 20.0, top: 24.0, bottom: 8.0),
          child: Row(
            mainAxisAlignment: .spaceBetween,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleSmall!.copyWith(
                  fontSize: 14,
                  letterSpacing: 1.0,
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurface.withValues(alpha: 0.3),
                ),
              ),
              Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: indicatorColor,
                      shape: .circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '$count Cards',
                    style: Theme.of(context).textTheme.labelMedium!.copyWith(
                      color: indicatorColor,
                      fontWeight: .bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(indent: 20, endIndent: 20),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const .symmetric(horizontal: 16.0),
          itemCount: cards.length,
          itemBuilder: (context, index) {
            final card = cards[index];
            return ListTile(
              onTap: () => context.push(AppRoutes.cardDetail(card.cardId)),
              leading: Container(
                width: 38,
                height: 54,
                decoration: BoxDecoration(
                  color: DeckLabTheme.darkSurface,
                  borderRadius: .circular(4),
                  border: .all(color: DeckLabTheme.borderDim),
                ),
                child: card.imageUrl != null
                    ? Image.network(
                        card.imageUrl!,
                        fit: .cover,
                        errorBuilder: (_, _, _) =>
                            const Icon(Icons.broken_image, size: 16),
                      )
                    : const Icon(Icons.image_outlined, size: 16),
              ),
              title: Text(
                card.name,
                style: Theme.of(
                  context,
                ).textTheme.bodyMedium!.copyWith(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(
                card.type ?? 'Unknown Type',
                style: Theme.of(context).textTheme.bodySmall!.copyWith(
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurface.withValues(alpha: 0.54),
                  fontSize: 11,
                ),
              ),
              trailing: Container(
                padding: const .symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: DeckLabTheme.darkSurfaceElevated,
                  borderRadius: .circular(6),
                ),
                child: Text(
                  'x${card.quantity}',
                  style: Theme.of(context).textTheme.labelSmall!.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: .bold,
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
