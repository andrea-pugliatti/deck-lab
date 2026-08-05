import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/ui/core/widgets/confirm_dialog.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';

void main() {
  group('ConfirmDialog Widget Tests', () {
    testWidgets('renders correct title, message, and button labels', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ConfirmDialog(
              title: 'Delete Deck',
              message: 'Are you sure you want to delete this deck blueprint?',
              confirmLabel: 'Yes, Delete',
              cancelLabel: 'No, Keep',
            ),
          ),
        ),
      );

      expect(find.text('Delete Deck'), findsOneWidget);
      expect(
        find.text('Are you sure you want to delete this deck blueprint?'),
        findsOneWidget,
      );
      expect(find.text('Yes, Delete'), findsOneWidget);
      expect(find.text('No, Keep'), findsOneWidget);
    });

    testWidgets('pops with true on confirm tap', (WidgetTester tester) async {
      bool? dialogResult;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) {
                return ElevatedButton(
                  onPressed: () async {
                    dialogResult = await showDialog<bool>(
                      context: context,
                      builder: (context) => const ConfirmDialog(
                        title: 'Confirm Action',
                        message: 'Message content',
                      ),
                    );
                  },
                  child: const Text('Show Dialog'),
                );
              },
            ),
          ),
        ),
      );

      // Open Dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      // Find confirm button. In ConfirmDialog, confirm is the second CustomButton
      // Let's find custom button with 'Delete' text (since it is the default confirmLabel)
      final confirmBtn = find.widgetWithText(CustomButton, 'Delete');
      expect(confirmBtn, findsOneWidget);

      await tester.tap(confirmBtn);
      await tester.pumpAndSettle();

      expect(dialogResult, isTrue);
    });

    testWidgets('pops with false on cancel tap', (WidgetTester tester) async {
      bool? dialogResult;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) {
                return ElevatedButton(
                  onPressed: () async {
                    dialogResult = await showDialog<bool>(
                      context: context,
                      builder: (context) => const ConfirmDialog(
                        title: 'Confirm Action',
                        message: 'Message content',
                      ),
                    );
                  },
                  child: const Text('Show Dialog'),
                );
              },
            ),
          ),
        ),
      );

      // Open Dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      // Find cancel button. Default cancelLabel is 'Cancel'
      final cancelBtn = find.widgetWithText(CustomButton, 'Cancel');
      expect(cancelBtn, findsOneWidget);

      await tester.tap(cancelBtn);
      await tester.pumpAndSettle();

      expect(dialogResult, isFalse);
    });

    testWidgets('renders loading state when isConfirming is true', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ConfirmDialog(
              title: 'Confirm Action',
              message: 'Message content',
              isConfirming: true,
            ),
          ),
        ),
      );

      // The confirm button should show a CircularProgressIndicator
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}
