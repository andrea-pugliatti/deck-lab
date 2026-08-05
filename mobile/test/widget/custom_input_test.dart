import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/ui/core/widgets/custom_input.dart';

void main() {
  group('CustomInput Widget Tests', () {
    late TextEditingController controller;

    setUp(() {
      controller = TextEditingController();
    });

    tearDown(() {
      controller.dispose();
    });

    testWidgets('renders input label and placeholder correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomInput(
              label: 'Username',
              placeholder: 'Enter username',
              controller: controller,
            ),
          ),
        ),
      );

      expect(find.text('Username'), findsOneWidget);
      expect(find.text('Enter username'), findsOneWidget);
    });

    testWidgets('supports entering text', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomInput(label: 'Username', controller: controller),
          ),
        ),
      );

      await tester.enterText(find.byType(TextFormField), 'andrea');
      expect(controller.text, 'andrea');
    });

    testWidgets('obscures password text and supports visibility toggles', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomInput(
              label: 'Password',
              isPassword: true,
              controller: controller,
            ),
          ),
        ),
      );

      final textFieldFinder = find.byType(TextField);
      final textFieldWidget = tester.widget<TextField>(textFieldFinder);
      expect(textFieldWidget.obscureText, isTrue);

      // Tap show visibility toggle
      await tester.tap(find.byType(IconButton));
      await tester.pump();

      final updatedWidget = tester.widget<TextField>(textFieldFinder);
      expect(updatedWidget.obscureText, isFalse);
    });

    testWidgets('triggers validation error', (WidgetTester tester) async {
      final formKey = GlobalKey<FormState>();
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Form(
              key: formKey,
              child: CustomInput(
                label: 'Email',
                controller: controller,
                validator: (val) {
                  if (val == null || val.isEmpty) {
                    return 'Email is required';
                  }
                  return null;
                },
              ),
            ),
          ),
        ),
      );

      formKey.currentState!.validate();
      await tester.pump();

      expect(find.text('Email is required'), findsOneWidget);
    });
  });
}
