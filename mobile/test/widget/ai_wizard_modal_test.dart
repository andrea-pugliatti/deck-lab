import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/core/widgets/custom_input.dart';
import 'package:mobile/ui/features/deck_builder/widgets/ai_wizard_modal.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('AiWizardModal Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late MockDeckRepository mockDeckRepository;
    late MockCardRepository mockCardRepository;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      mockDeckRepository = MockDeckRepository();
      mockCardRepository = MockCardRepository();
    });

    testWidgets(
      'renders modal fields and executes generate trigger on submit',
      (WidgetTester tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
              deckRepositoryProvider.overrideWithValue(mockDeckRepository),
              cardRepositoryProvider.overrideWithValue(mockCardRepository),
            ],
            child: MaterialApp(
              home: Scaffold(
                body: Builder(
                  builder: (context) => ElevatedButton(
                    onPressed: () => AiWizardModal.show(context),
                    child: const Text('Open Modal'),
                  ),
                ),
              ),
            ),
          ),
        );

        // Open Modal
        await tester.tap(find.text('Open Modal'));
        await tester.pumpAndSettle();

        // Check header title
        expect(find.text('AI DECK GENERATOR'), findsOneWidget);
        expect(find.text('Gameplay Strategy'), findsOneWidget);

        // Submit immediately to test validation
        await tester.tap(find.widgetWithText(CustomButton, 'Generate Deck'));
        await tester.pumpAndSettle();

        expect(find.text('Archetype is required'), findsOneWidget);

        // Input valid archetype
        final inputs = find.byType(CustomInput);
        await tester.enterText(inputs.at(0), 'Cyber Dragon');
        await tester.enterText(inputs.at(1), 'No handtraps rules');
        await tester.pumpAndSettle();

        // Tap generate button
        final buttonFinder = find.widgetWithText(CustomButton, 'Generate Deck');
        await tester.ensureVisible(buttonFinder);
        await tester.tap(buttonFinder);
        await tester.pumpAndSettle();

        // Modal should be closed/popped
        expect(find.text('AI DECK GENERATOR'), findsNothing);
      },
    );
  });
}
