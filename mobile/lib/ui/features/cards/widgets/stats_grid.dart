import 'package:flutter/material.dart' hide Card;
import 'package:mobile/ui/core/theme/theme.dart';
import 'package:mobile/ui/features/cards/widgets/stat_cell.dart';
import '../../../../domain/models/card.dart';

class StatsGrid extends StatelessWidget {
  final Card card;

  const StatsGrid({super.key, required this.card});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const .all(16),
      decoration: BoxDecoration(
        color: DeckLabTheme.darkSurface,
        border: .all(color: DeckLabTheme.borderDim),
        borderRadius: .circular(12),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: StatCell(title: 'ATK', val: card.atk?.toString() ?? '?'),
              ),
              Expanded(
                child: StatCell(title: 'DEF', val: card.def?.toString() ?? '?'),
              ),
              switch ((card.level, card.linkVal)) {
                (int level, _) => Expanded(
                  child: StatCell(title: 'LEVEL/RANK', val: level.toString()),
                ),
                (_, int linkVal) => Expanded(
                  child: StatCell(title: 'LINK VAL', val: linkVal.toString()),
                ),
                _ => const Expanded(child: SizedBox.shrink()),
              },
            ],
          ),
          if (card.attribute != null || card.race != null) ...[
            const Padding(
              padding: .symmetric(vertical: 12.0),
              child: Divider(height: 1),
            ),
            Row(
              children: [
                if (card.attribute != null)
                  Expanded(
                    child: StatCell(
                      title: 'ATTRIBUTE',
                      val: card.attribute!.toUpperCase(),
                    ),
                  )
                else
                  const Expanded(child: SizedBox.shrink()),
                if (card.race != null)
                  Expanded(
                    child: StatCell(
                      title: 'RACE',
                      val: card.race!.toUpperCase(),
                    ),
                  )
                else
                  const Expanded(child: SizedBox.shrink()),
                if (card.scale != null)
                  Expanded(
                    child: StatCell(title: 'SCALE', val: card.scale.toString()),
                  )
                else
                  const Expanded(child: SizedBox.shrink()),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
