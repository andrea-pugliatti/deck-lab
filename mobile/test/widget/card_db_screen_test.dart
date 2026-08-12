import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/features/cards/views/card_db_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('CardDbScreen Widget Tests', () {
    late MockCardRepository mockCardRepository;
    late GoRouter router;

    setUp(() {
      mockCardRepository = MockCardRepository();

      router = GoRouter(
        initialLocation: '/cards',
        routes: [
          GoRoute(
            path: '/cards',
            builder: (context, state) => const CardDbScreen(),
          ),
          GoRoute(
            path: '/cards/:id',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return Scaffold(body: Text('Card Detail Page: $id'));
            },
          ),
        ],
      );
    });

    testWidgets(
      'renders search bar, cards list grid and handles route navigation',
      (WidgetTester tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              cardRepositoryProvider.overrideWithValue(mockCardRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        // Check header title
        expect(find.text('Card Database'), findsOneWidget);
        // Check search input field
        expect(find.byType(TextField), findsOneWidget);

        // Verify mock card renders in the grid view
        expect(find.text('Blue-Eyes White Dragon'), findsOneWidget);

        // Tap on card grid item
        await tester.tap(find.text('Blue-Eyes White Dragon'));
        await tester.pumpAndSettle();

        // Check navigation to card details page
        expect(find.text('Card Detail Page: 101'), findsOneWidget);
      },
    );

    testWidgets('displays empty state message when search returns no items', (
      WidgetTester tester,
    ) async {
      mockCardRepository.cardCatalog = [];

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Verify empty view text details
      expect(find.text('No Cards Found'), findsOneWidget);
      expect(
        find.text('Try adjusting filters or search parameters'),
        findsOneWidget,
      );
    });

    testWidgets('tapping filter action opens catalog filters sheet', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Tap filter icon in appbar
      await tester.tap(find.byIcon(Icons.filter_alt));
      await tester.pumpAndSettle();

      // Check filters sheet opened and displays header
      expect(find.text('Catalog Filters'), findsOneWidget);
      expect(find.text('Card Type'), findsOneWidget);
      expect(find.text('Monster Attribute'), findsOneWidget);
      expect(find.text('Race / Property'), findsOneWidget);
      expect(find.text('Apply Filters'), findsOneWidget);
    });
  });
}
