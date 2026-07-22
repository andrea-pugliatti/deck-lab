import 'package:flutter/material.dart' hide Card;
import 'package:mobile/domain/models/card.dart';
import 'package:mobile/domain/models/card_suggestion.dart';
import 'package:mobile/ui/features/deck_builder/view_models/deck_builder_provider.dart';

import '../../../core/theme/theme.dart';

class AiSuggestionsPanel extends StatelessWidget {
  final List<CardSuggestion> suggestions;
  final DeckBuilderNotifier notifier;

  const AiSuggestionsPanel({
    super.key,
    required this.suggestions,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 94,
      color: DeckLabTheme.darkSurfaceElevated.withValues(alpha: 0.5),
      padding: const .symmetric(vertical: 8.0, horizontal: 12.0),
      child: Column(
        crossAxisAlignment: .start,
        children: [
          Builder(
            builder: (context) => Text(
              'AI RECOMMENDED CARDS:',
              style: Theme.of(context).textTheme.labelSmall!.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: .bold,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Expanded(
            child: ListView.builder(
              scrollDirection: .horizontal,
              itemCount: suggestions.length,
              itemBuilder: (context, index) {
                final suggestion = suggestions[index];
                return Padding(
                  padding: const .only(right: 8.0),
                  child: ActionChip(
                    backgroundColor: DeckLabTheme.darkSurface,
                    side: const BorderSide(color: DeckLabTheme.borderDim),
                    shape: RoundedRectangleBorder(borderRadius: .circular(8)),
                    avatar: suggestion.imageUrl != null
                        ? Image.network(suggestion.imageUrl!)
                        : Icon(
                            Icons.auto_awesome,
                            color: Theme.of(context).colorScheme.secondary,
                            size: 12,
                          ),
                    label: Text(
                      '${suggestion.name} (${suggestion.section})',
                      style: Theme.of(context).textTheme.labelSmall!.copyWith(
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    onPressed: () {
                      final card = Card(
                        id: suggestion.cardId,
                        name: suggestion.name,
                        type: suggestion.type,
                        imageUrl: suggestion.imageUrl,
                      );
                      notifier.addCard(card, suggestion.section);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
