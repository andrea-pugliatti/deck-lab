import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('App landing render smoke test', (WidgetTester tester) async {
    // Build our app wrapping in ProviderScope and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: MyApp()));

    // Let the route animations and initial checks settle
    await tester.pumpAndSettle();

    // Verify that the AppBar title "DeckLab" exists
    expect(find.text('DeckLab'), findsOneWidget);

    // Verify that bottom navigation shell items are visible
    expect(find.text('Decks'), findsOneWidget);
    expect(find.text('Cards'), findsOneWidget);
    expect(find.text('Simulator'), findsOneWidget);
    expect(find.text('Home'), findsNothing);
  });
}
