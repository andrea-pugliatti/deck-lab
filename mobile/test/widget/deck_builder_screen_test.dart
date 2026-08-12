import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/domain/models/deck_detail.dart';
import 'package:mobile/domain/models/deck_validation.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/custom_input.dart';
import 'package:mobile/ui/features/deck_builder/views/deck_builder_screen.dart';
import 'package:mobile/ui/features/deck_builder/widgets/ai_wizard_modal.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('DeckBuilderScreen Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late MockDeckRepository mockDeckRepository;
    late MockCardRepository mockCardRepository;
    late GoRouter router;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      mockDeckRepository = MockDeckRepository();
      mockCardRepository = MockCardRepository();

      router = GoRouter(
        initialLocation: '/decks/create',
        routes: [
          GoRoute(
            path: '/decks/create',
            builder: (context, state) => const DeckBuilderScreen(deckId: null),
          ),
          GoRoute(
            path: '/decks/:id/edit',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return DeckBuilderScreen(deckId: int.parse(id));
            },
          ),
          GoRoute(
            path: '/decks/:id',
            builder: (context, state) => Scaffold(
              body: Text('Deck Detail Page: ${state.pathParameters['id']}'),
            ),
          ),
        ],
      );
    });

    testWidgets(
      'creation mode starts with empty values and saves successfully',
      (WidgetTester tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
              cardRepositoryProvider.overrideWithValue(mockCardRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        // Check title CONSTRUCT DECK
        expect(find.text('CONSTRUCT DECK'), findsOneWidget);

        // Enter name and strategy notes
        final inputs = find.byType(CustomInput);
        await tester.enterText(inputs.at(0), 'Kaiba Dragon deck');
        await tester.enterText(inputs.at(1), 'Beatdown strategy notes');
        await tester.pumpAndSettle();

        // Click save button in AppBar
        await tester.tap(find.byIcon(Icons.save));
        await tester.pumpAndSettle();

        // Verify redirection to details page
        expect(find.text('Deck Detail Page: 1'), findsOneWidget);
      },
    );

    testWidgets('edit mode initializes fields with preloaded deck data', (
      WidgetTester tester,
    ) async {
      mockDeckRepository.deckDetail = const DeckDetail(
        id: 42,
        name: 'Dark Magician Control',
        description: 'Spellcaster notes',
        formatName: Format.ocg,
        deckCards: [
          DeckCard(
            cardId: 101,
            name: 'Dark Magician',
            section: DeckSection.main,
            quantity: 3,
          ),
        ],
      );

      router.go('/decks/42/edit');

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Check title EDIT DECK
      expect(find.text('EDIT DECK'), findsOneWidget);

      // Verify inputs have correct default text
      final nameInputFinder = find.widgetWithText(CustomInput, 'Deck Name');
      final descInputFinder = find.widgetWithText(
        CustomInput,
        'Strategy Notes',
      );

      expect(
        find.descendant(
          of: nameInputFinder,
          matching: find.text('Dark Magician Control'),
        ),
        findsOneWidget,
      );
      expect(
        find.descendant(
          of: descInputFinder,
          matching: find.text('Spellcaster notes'),
        ),
        findsOneWidget,
      );

      // Verify preloaded deck card renders in the list
      expect(find.text('Dark Magician'), findsOneWidget);
      expect(find.text('3 Cards'), findsOneWidget);
    });

    testWidgets(
      'renders rules check warnings banner when validation errors exist',
      (WidgetTester tester) async {
        // Mock validation failure
        mockDeckRepository.validationResponse = const DeckValidation(
          isValid: false,
          errors: [
            'Main deck must contain at least 40 cards.',
            'Cannot run more than 3 copies of any card.',
          ],
        );

        mockDeckRepository.deckDetail = const DeckDetail(
          id: 42,
          name: 'Dragon deck',
          formatName: Format.tcg,
          deckCards: [
            DeckCard(
              cardId: 101,
              name: 'Blue-Eyes White Dragon',
              section: DeckSection.main,
              quantity: 3,
            ),
          ],
        );

        router.go('/decks/42/edit');

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
              cardRepositoryProvider.overrideWithValue(mockCardRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        // Check validation warnings banner renders
        expect(find.text('VALIDATION WARNINGS'), findsOneWidget);
        expect(
          find.text('• Main deck must contain at least 40 cards.'),
          findsOneWidget,
        );
      },
    );

    testWidgets(
      'supports switching to ADD CARDS tab and searching library results',
      (WidgetTester tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
              cardRepositoryProvider.overrideWithValue(mockCardRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        // Tap ADD CARDS tab
        await tester.tap(find.text('ADD CARDS'));
        await tester.pumpAndSettle();

        // Verify search input field exists in add cards panel
        expect(
          find.byWidgetPredicate(
            (w) =>
                w is TextField &&
                w.decoration?.hintText == 'Search card database...',
          ),
          findsOneWidget,
        );

        // Verify library search card list loads mock card
        expect(find.text('Blue-Eyes White Dragon'), findsOneWidget);
        expect(find.byIcon(Icons.add_circle_outline), findsWidgets);
      },
    );

    testWidgets('tapping auto awesome action icon opens AI Wizard modal', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Tap AI Wizard icon in AppBar
      await tester.tap(find.byIcon(Icons.auto_awesome));
      await tester.pumpAndSettle();

      // Verify AiWizardModal dialog renders
      expect(find.byType(AiWizardModal), findsOneWidget);
    });

    testWidgets('renders import .ydk file button in action bar', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.file_upload_outlined), findsOneWidget);
    });
  });
}
