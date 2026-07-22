import 'package:flutter/material.dart' hide Card;
import 'package:mobile/domain/models/card.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/ui/features/deck_builder/view_models/deck_builder_provider.dart';

import '../../../core/theme/theme.dart';

class BuilderSection extends StatelessWidget {
  final String title;
  final Iterable<DeckCard> cards;
  final int count;
  final Color indicatorColor;
  final String sectionKey;
  final DeckBuilderNotifier notifier;

  const BuilderSection({
    super.key,
    required this.title,
    required this.cards,
    required this.count,
    required this.indicatorColor,
    required this.sectionKey,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: .start,
      children: [
        Padding(
          padding: const .only(top: 24.0, bottom: 8.0),
          child: Row(
            mainAxisAlignment: .spaceBetween,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleSmall!.copyWith(
                  fontSize: 13,
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurface.withValues(alpha: 0.38),
                ),
              ),
              Text(
                '$count Cards',
                style: Theme.of(context).textTheme.labelMedium!.copyWith(
                  color: indicatorColor,
                  fontWeight: .bold,
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1),
        if (cards.isEmpty)
          Padding(
            padding: const .symmetric(vertical: 16.0),
            child: Text(
              'No cards added in this section.',
              style: Theme.of(context).textTheme.bodySmall!.copyWith(
                color: Theme.of(
                  context,
                ).colorScheme.onSurface.withValues(alpha: 0.3),
                fontStyle: .italic,
              ),
            ),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: cards.length,
            itemBuilder: (context, index) {
              final card = cards.elementAt(index);
              return ListTile(
                contentPadding: .zero,
                leading: Container(
                  width: 32,
                  height: 48,
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
                              const Icon(Icons.broken_image, size: 14),
                        )
                      : const Icon(Icons.image_outlined, size: 14),
                ),
                title: Text(
                  card.name,
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium!.copyWith(fontWeight: FontWeight.bold),
                ),
                trailing: Row(
                  mainAxisSize: .min,
                  children: [
                    IconButton(
                      icon: Icon(
                        Icons.remove_circle_outline,
                        color: Theme.of(context).colorScheme.error,
                        size: 20,
                      ),
                      onPressed: () {
                        notifier.removeCard(card.cardId, sectionKey);
                      },
                    ),
                    Text(
                      '${card.quantity}',
                      style: Theme.of(
                        context,
                      ).textTheme.bodyMedium!.copyWith(fontWeight: .bold),
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.add_circle_outline,
                        color: Theme.of(context).colorScheme.secondary,
                        size: 20,
                      ),
                      onPressed: () {
                        final tempCard = Card(
                          id: card.cardId,
                          name: card.name,
                          type: card.type ?? '',
                          imageUrl: card.imageUrl,
                        );
                        notifier.addCard(tempCard, sectionKey);
                      },
                    ),
                  ],
                ),
              );
            },
          ),
      ],
    );
  }
}
