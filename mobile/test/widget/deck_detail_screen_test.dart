import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/confirm_dialog.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/features/decks/views/deck_detail_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('DeckDetailScreen Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late MockDeckRepository mockDeckRepository;
    late GoRouter router;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      mockDeckRepository = MockDeckRepository();

      router = GoRouter(
        initialLocation: '/decks/1',
        routes: [
          GoRoute(
            path: '/decks/:id',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return DeckDetailScreen(deckId: int.parse(id));
            },
          ),
          GoRoute(
            path: '/decks/:id/edit',
            builder: (context, state) =>
                const Scaffold(body: Text('Edit Deck Page')),
          ),
          GoRoute(
            path: '/simulator',
            builder: (context, state) =>
                const Scaffold(body: Text('Simulator Page')),
          ),
          GoRoute(
            path: '/cards/:id',
            builder: (context, state) => Scaffold(
              body: Text('Card Detail Page: ${state.pathParameters['id']}'),
            ),
          ),
        ],
      );
    });

    testWidgets(
      'renders deck metadata and cards list for guest user without edit/delete buttons',
      (WidgetTester tester) async {
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

        // Verify header titles and strategy text
        expect(find.text('BLUE-EYES ULTIMATE'), findsOneWidget);
        expect(find.text('created by Kaiba'), findsOneWidget);
        expect(find.text('Classic beatdown deck.'), findsOneWidget);

        // Verify edit/delete icons are missing for guest
        expect(find.byIcon(Icons.edit_outlined), findsNothing);
        expect(find.byIcon(Icons.delete_outline), findsNothing);

        // Verify sections lists cards render
        expect(find.text('MAIN DECK'), findsOneWidget);
        expect(find.text('3 Cards'), findsOneWidget);
        expect(find.text('Blue-Eyes White Dragon'), findsOneWidget);
        expect(find.text('x3'), findsOneWidget);
      },
    );

    testWidgets(
      'renders edit and delete buttons for owner and handles delete confirmation',
      (WidgetTester tester) async {
        mockAuthRepository.silentLoginResult =
            'Kaiba'; // matches creatorUsername

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

        // Verify actions exist
        expect(find.byIcon(Icons.edit_outlined), findsOneWidget);
        expect(find.byIcon(Icons.delete_outline), findsOneWidget);

        // Click delete icon
        await tester.tap(find.byIcon(Icons.delete_outline));
        await tester.pumpAndSettle();

        // Verify ConfirmDialog renders
        expect(find.byType(ConfirmDialog), findsOneWidget);
        expect(
          find.textContaining('Are you sure you want to delete this deck?'),
          findsOneWidget,
        );

        // Tap cancel in ConfirmDialog
        await tester.tap(find.widgetWithText(CustomButton, 'Cancel'));
        await tester.pumpAndSettle();

        // Verify dialog closed
        expect(find.byType(ConfirmDialog), findsNothing);
      },
    );

    testWidgets('tapping edit redirects to editor', (
      WidgetTester tester,
    ) async {
      mockAuthRepository.silentLoginResult = 'Kaiba';

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

      await tester.tap(find.byIcon(Icons.edit_outlined));
      await tester.pumpAndSettle();

      expect(find.text('Edit Deck Page'), findsOneWidget);
    });

    testWidgets('tapping simulate starting hands redirects to /simulator', (
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

      await tester.tap(
        find.widgetWithText(CustomButton, 'Simulate Starting Hands'),
      );
      await tester.pumpAndSettle();

      expect(find.text('Simulator Page'), findsOneWidget);
    });

    testWidgets('tapping a card redirects to its card details', (
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

      await tester.tap(find.text('Blue-Eyes White Dragon'));
      await tester.pumpAndSettle();

      expect(find.text('Card Detail Page: 101'), findsOneWidget);
    });

    testWidgets('renders export .ydk button in action bar', (
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

      expect(find.byIcon(Icons.file_download_outlined), findsOneWidget);
    });
  });
}
