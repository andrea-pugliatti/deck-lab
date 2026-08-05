import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/card.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/features/cards/views/card_detail_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('CardDetailScreen Widget Tests', () {
    late MockCardRepository mockCardRepository;

    setUp(() {
      mockCardRepository = MockCardRepository();
    });

    testWidgets('renders detailed stats and description for monster card', (
      WidgetTester tester,
    ) async {
      mockCardRepository.cardCatalog = [
        const Card(
          id: 101,
          name: 'Blue-Eyes White Dragon',
          type: CardType.normalMonster,
          description:
              'This legendary dragon is a powerful engine of destruction.',
          attribute: CardAttribute.light,
          race: CardRace.dragon,
          archetype: 'Blue-Eyes',
          imageUrl: 'blue_eyes.jpg',
          atk: 3000,
          def: 2500,
          level: 8,
        ),
      ];

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: const MaterialApp(home: CardDetailScreen(cardId: 101)),
        ),
      );

      // Verify progress loader executes
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      await tester.pumpAndSettle();

      // Check card detail content renders
      expect(find.text('BLUE-EYES WHITE DRAGON'), findsOneWidget);
      expect(find.text('NORMAL MONSTER'), findsOneWidget);
      expect(find.text('BLUE-EYES'), findsOneWidget);

      // Verify stats grid
      expect(find.text('ATK'), findsOneWidget);
      expect(find.text('3000'), findsOneWidget);
      expect(find.text('DEF'), findsOneWidget);
      expect(find.text('2500'), findsOneWidget);
      expect(find.text('LEVEL/RANK'), findsOneWidget);
      expect(find.text('8'), findsOneWidget);

      // Verify text
      expect(
        find.text('This legendary dragon is a powerful engine of destruction.'),
        findsOneWidget,
      );
    });

    testWidgets('renders error state and triggers retry callback on failure', (
      WidgetTester tester,
    ) async {
      mockCardRepository.shouldFail = true;

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: const MaterialApp(home: CardDetailScreen(cardId: 101)),
        ),
      );

      await tester.pumpAndSettle();

      // Verify failure page widgets are loaded
      expect(find.text('Failed to load card details'), findsOneWidget);
      expect(find.byIcon(Icons.error_outline), findsOneWidget);

      final retryBtn = find.widgetWithText(CustomButton, 'Retry');
      expect(retryBtn, findsOneWidget);

      // Reset failure state and click retry
      mockCardRepository.shouldFail = false;
      await tester.tap(retryBtn);
      await tester.pumpAndSettle();

      // Verify data loads successfully
      expect(find.text('BLUE-EYES WHITE DRAGON'), findsOneWidget);
    });
  });
}
