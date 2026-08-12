import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/features/decks/views/decks_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('DecksScreen Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late MockDeckRepository mockDeckRepository;
    late GoRouter router;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      mockDeckRepository = MockDeckRepository();

      router = GoRouter(
        initialLocation: '/',
        routes: [
          GoRoute(path: '/', builder: (context, state) => const DecksScreen()),
          GoRoute(
            path: '/decks/create',
            builder: (context, state) =>
                const Scaffold(body: Text('Create Deck Page')),
          ),
          GoRoute(
            path: '/decks/:id',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return Scaffold(body: Text('Deck Detail Page: $id'));
            },
          ),
          GoRoute(
            path: '/login',
            builder: (context, state) =>
                const Scaffold(body: Text('Login Page')),
          ),
        ],
      );
    });

    testWidgets(
      'renders public decks list for guest users and supports search/filter chips',
      (WidgetTester tester) async {
        // Set guest user state
        mockAuthRepository.silentLoginResult = null;

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        // Wait for build() silent login verification and initial fetch of formats/decks
        await tester.pumpAndSettle();

        // Check app bar title shows DeckLab
        expect(find.text('DeckLab'), findsOneWidget);
        // Check login button displays for guests
        expect(find.text('LOGIN'), findsOneWidget);
        // FAB button should not exist
        expect(find.byType(FloatingActionButton), findsNothing);

        // Check format chips are rendered
        expect(find.text('ALL'), findsOneWidget);
        expect(find.text('TCG'), findsNWidgets(2));
        expect(find.text('OCG'), findsOneWidget);

        // Verify public deck is rendered
        expect(find.text('BLUE-EYES ULTIMATE'), findsOneWidget);
        expect(find.text('by Kaiba'), findsOneWidget);
      },
    );

    testWidgets('renders my blueprint tabs and FAB for logged-in users', (
      WidgetTester tester,
    ) async {
      // Set logged-in state
      mockAuthRepository.silentLoginResult = 'kaiba';

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Verify tab buttons show for logged-in user
      expect(find.text('PUBLIC DECKS'), findsOneWidget);
      expect(find.text('MY DECKS'), findsOneWidget);

      // Verify FloatingActionButton exists
      expect(find.byType(FloatingActionButton), findsOneWidget);

      // Switch to MY DECKS
      await tester.tap(find.text('MY DECKS'));
      await tester.pumpAndSettle();

      // Verify tab button exists
      expect(find.text('MY DECKS'), findsOneWidget);

      // Verify user deck renders
      expect(find.text('DARK MAGICIAN CONTROL'), findsOneWidget);
      expect(find.text('by Yugi'), findsOneWidget);
    });

    testWidgets('tapping deck card navigates to deck detail screen', (
      WidgetTester tester,
    ) async {
      mockAuthRepository.silentLoginResult = null;

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Tap public deck card
      await tester.tap(find.text('BLUE-EYES ULTIMATE'));
      await tester.pumpAndSettle();

      // Check navigation to deck detail
      expect(find.text('Deck Detail Page: 1'), findsOneWidget);
    });

    testWidgets(
      'tapping floating action button redirects to deck builder create',
      (WidgetTester tester) async {
        mockAuthRepository.silentLoginResult = 'kaiba';

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        // Tap FAB
        await tester.tap(find.byType(FloatingActionButton));
        await tester.pumpAndSettle();

        expect(find.text('Create Deck Page'), findsOneWidget);
      },
    );

    testWidgets('renders empty state when deck list is empty', (
      WidgetTester tester,
    ) async {
      mockAuthRepository.silentLoginResult = null;
      mockDeckRepository.publicDecksList = [];

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Verify empty state warning details
      expect(find.text('No Decks Found'), findsOneWidget);
      expect(
        find.text('Try adjusting filters or search parameters'),
        findsOneWidget,
      );
    });
  });
}
