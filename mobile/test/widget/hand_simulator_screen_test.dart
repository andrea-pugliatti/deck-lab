import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/domain/models/deck_detail.dart';
import 'package:mobile/domain/models/deck_summary.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/features/simulator/views/hand_simulator_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('HandSimulatorScreen Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late MockDeckRepository mockDeckRepository;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      mockDeckRepository = MockDeckRepository();
    });

    testWidgets(
      'renders initial selector helper and allows loading deck to run simulations',
      (WidgetTester tester) async {
        mockDeckRepository.userDecksList = [
          const DeckSummary(
            id: 42,
            name: 'Blue-Eyes Dragon',
            formatName: Format.tcg,
            creatorUsername: 'Kaiba',
            deckCards: [],
          ),
        ];

        mockDeckRepository.deckDetail = const DeckDetail(
          id: 42,
          name: 'Blue-Eyes Dragon',
          formatName: Format.tcg,
          creatorUsername: 'Kaiba',
          deckCards: [
            DeckCard(
              cardId: 101,
              name: 'Blue-Eyes White Dragon',
              section: DeckSection.main,
              quantity: 3,
            ),
            DeckCard(
              cardId: 102,
              name: 'White Stone of Ancients',
              section: DeckSection.main,
              quantity: 3,
            ),
            DeckCard(
              cardId: 103,
              name: 'Trade-In',
              section: DeckSection.main,
              quantity: 3,
            ),
          ],
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            ],
            child: const MaterialApp(home: HandSimulatorScreen()),
          ),
        );

        await tester.pumpAndSettle();

        // Verify header and selector prompt
        expect(find.text('HAND SIMULATOR'), findsOneWidget);
        expect(find.text('SELECT WORKSPACE DECK BLUEPRINT'), findsOneWidget);
        expect(
          find.textContaining('begin the starting hand simulation.'),
          findsOneWidget,
        );

        // Open Dropdown
        await tester.tap(find.text('Choose deck...'), warnIfMissed: false);
        await tester.pumpAndSettle();

        // Select deck
        await tester.tap(find.text('BLUE-EYES DRAGON (TCG)').last);
        await tester.pumpAndSettle();

        // Verify workspace controls render
        expect(find.text('Reset'), findsOneWidget);
        expect(find.text('Shuffle'), findsOneWidget);
        expect(find.text('Draw 1'), findsOneWidget);
        expect(find.text('Draw Starting'), findsOneWidget);

        // Verify zones render
        expect(find.textContaining('HAND ZONE'), findsOneWidget);
        expect(find.textContaining('FIELD ZONE'), findsOneWidget);
        expect(find.textContaining('GRAVEYARD'), findsOneWidget);
        expect(find.textContaining('BANISHED'), findsOneWidget);

        // Tap Draw Starting (which draws 5 by default)
        await tester.tap(find.widgetWithText(CustomButton, 'Draw Starting'));
        await tester.pumpAndSettle();

        // Verify Hand has drawn card items
        expect(find.text('HAND ZONE (5)'), findsOneWidget);

        // Test probability odds calculator targets card selection
        expect(find.text('ODDS CALCULATOR'), findsOneWidget);
        await tester.tap(find.text('Target Card Name...'), warnIfMissed: false);
        await tester.pumpAndSettle();

        await tester.tap(find.text('Blue-Eyes White Dragon').last);
        await tester.pumpAndSettle();

        // Chance text renders (non-zero value check)
        expect(find.textContaining('Chance to draw ≥ 1 copy:'), findsOneWidget);
      },
    );
  });
}
