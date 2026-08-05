import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';

void main() {
  group('CustomButton Widget Tests', () {
    testWidgets('renders button text correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(text: 'Click Me', onPressed: () {}),
          ),
        ),
      );

      expect(find.text('Click Me'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsNothing);
    });

    testWidgets('triggers onPressed callback on tap', (
      WidgetTester tester,
    ) async {
      bool pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Click Me',
              onPressed: () {
                pressed = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byType(CustomButton));
      await tester.pump();

      expect(pressed, isTrue);
    });

    testWidgets('renders loading state without executing tap', (
      WidgetTester tester,
    ) async {
      bool pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Click Me',
              isLoading: true,
              onPressed: () {
                pressed = true;
              },
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Click Me'), findsNothing);

      await tester.tap(find.byType(CircularProgressIndicator));
      await tester.pump();

      expect(pressed, isFalse);
    });
  });
}
