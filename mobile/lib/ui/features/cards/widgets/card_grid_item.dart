import 'package:flutter/material.dart' hide Card;
import 'package:go_router/go_router.dart';
import 'package:mobile/domain/models/card.dart';

import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';

class CardGridItem extends StatelessWidget {
  final Card card;

  const CardGridItem({super.key, required this.card});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return InkWell(
      onTap: () => context.push(AppRoutes.cardDetail(card.id)),
      borderRadius: .circular(8),
      child: Container(
        decoration: BoxDecoration(
          color: DeckLabTheme.darkSurface,
          borderRadius: .circular(8),
          border: .all(color: DeckLabTheme.borderDim),
        ),
        child: Column(
          crossAxisAlignment: .stretch,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: const .vertical(top: .circular(8)),
                child: card.imageUrl != null
                    ? Image.network(
                        card.imageUrl!,
                        fit: .cover,
                        errorBuilder: (_, _, _) => Center(
                          child: Icon(
                            Icons.broken_image,
                            color: cs.onSurface.withValues(alpha: 0.24),
                          ),
                        ),
                      )
                    : Center(
                        child: Icon(
                          Icons.image_outlined,
                          color: cs.onSurface.withValues(alpha: 0.24),
                        ),
                      ),
              ),
            ),
            Padding(
              padding: const .symmetric(vertical: 6.0, horizontal: 8.0),
              child: Text(
                card.name,
                maxLines: 1,
                overflow: .ellipsis,
                textAlign: .center,
                style: tt.labelSmall!.copyWith(
                  color: cs.onSurface.withValues(alpha: 0.7),
                  fontWeight: .bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
