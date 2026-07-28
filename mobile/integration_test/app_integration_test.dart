import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/main.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('End-to-End Navigation Integration Test', () {
    testWidgets(
      'verify app launch, dashboard rendering, and auth navigation flow',
      (WidgetTester tester) async {
        // Build our app wrapping in ProviderScope and trigger a frame.
        await tester.pumpWidget(const ProviderScope(child: MyApp()));

        // Settle animations and startup redirects
        await tester.pumpAndSettle();

        // Verify that the landing brand title "DECKLAB" exists
        expect(find.text('DECKLAB'), findsOneWidget);

        // Verify bottom navigation shell tabs are rendered
        expect(find.text('Home'), findsOneWidget);
        expect(find.text('Decks'), findsOneWidget);
        expect(find.text('Cards'), findsOneWidget);
        expect(find.text('Simulator'), findsOneWidget);

        // Tap on "Decks" tab to navigate to the catalog list
        await tester.tap(find.text('Decks'));
        await tester.pumpAndSettle();

        // Verify that the dashboard screen header is displayed
        expect(find.text('PUBLIC DECKS'), findsOneWidget);

        // Tap the Login button to test page pushing
        final loginBtn = find.text('LOGIN');
        expect(loginBtn, findsOneWidget);
        await tester.tap(loginBtn);
        await tester.pumpAndSettle();

        // Verify that we are on the login screen
        expect(find.text('DECKLAB SYSTEM'), findsOneWidget);
        expect(
          find.byType(TextFormField),
          findsNWidgets(2),
        ); // Username & Password fields
      },
    );
  });
}
