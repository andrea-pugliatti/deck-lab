import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/ui/core/widgets/shimmer_placeholder.dart';
import 'package:shimmer/shimmer.dart';

void main() {
  group('ShimmerPlaceholder Widget Tests', () {
    testWidgets('renders placeholder container with correct dimensions', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: ShimmerPlaceholder(
              width: 150.0,
              height: 50.0,
              borderRadius: 12.0,
            ),
          ),
        ),
      );

      // Verify Shimmer widget is present
      expect(find.byType(Shimmer), findsOneWidget);

      // Verify container dimensions
      final containerFinder = find.byType(Container);
      expect(containerFinder, findsOneWidget);

      final containerWidget = tester.widget<Container>(containerFinder);
      expect(containerWidget.constraints?.minWidth, 150.0);
      expect(containerWidget.constraints?.minHeight, 50.0);

      final decoration = containerWidget.decoration as BoxDecoration?;
      expect(decoration?.borderRadius, BorderRadius.circular(12.0));
    });
  });
}
