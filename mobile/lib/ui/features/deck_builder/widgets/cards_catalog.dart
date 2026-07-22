import 'package:flutter/material.dart' hide Card;
import 'package:go_router/go_router.dart';
import 'package:mobile/domain/models/card.dart';
import 'package:mobile/navigation/routes.dart';
import 'package:mobile/ui/core/theme/theme.dart';
import 'package:mobile/ui/features/deck_builder/view_models/deck_builder_provider.dart';

class CardsCatalog extends StatelessWidget {
  final List<Card> cards;
  final String selectedSection;
  final DeckBuilderNotifier notifier;

  const CardsCatalog({
    super.key,
    required this.cards,
    required this.selectedSection,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const .symmetric(horizontal: 12.0),
      itemCount: cards.length,
      itemBuilder: (context, index) {
        final card = cards[index];
        return ListTile(
          onTap: () => context.push(AppRoutes.cardDetail(card.id)),
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
            ).textTheme.bodyMedium!.copyWith(fontWeight: .bold),
          ),
          subtitle: Text(
            card.type,
            style: Theme.of(context).textTheme.bodySmall!.copyWith(
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.54),
              fontSize: 11,
            ),
          ),
          trailing: IconButton(
            icon: Icon(
              Icons.add_circle_outline,
              color: Theme.of(context).colorScheme.secondary,
            ),
            onPressed: () {
              notifier.addCard(card, selectedSection);
            },
          ),
        );
      },
    );
  }
}
