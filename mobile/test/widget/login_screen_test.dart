import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/custom_input.dart';
import 'package:mobile/ui/features/auth/views/login_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('LoginScreen Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late GoRouter router;

    setUp(() {
      mockAuthRepository = MockAuthRepository();

      // Let's set silent login to null so build() starts in unauthenticated state
      mockAuthRepository.silentLoginResult = null;

      router = GoRouter(
        initialLocation: '/login',
        routes: [
          GoRoute(
            path: '/login',
            builder: (context, state) => const LoginScreen(),
          ),
          GoRoute(
            path: '/',
            builder: (context, state) =>
                const Scaffold(body: Text('Decks Dashboard Page')),
          ),
          GoRoute(
            path: '/register',
            builder: (context, state) =>
                const Scaffold(body: Text('Register Page')),
          ),
        ],
      );
    });

    testWidgets('requires non-empty credentials validation', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Verify page title
      expect(find.text('DeckLab'), findsOneWidget);

      // Tap Login directly
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();

      // Check validation error text
      expect(find.text('Username is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);
    });

    testWidgets('executes login and redirects to /decks on success', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Enter username & password
      final customInputs = find.byType(CustomInput);
      await tester.enterText(customInputs.at(0), 'kaiba');
      await tester.enterText(customInputs.at(1), 'blueeyes');

      // Tap Login
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();

      // Verify routing happened
      expect(find.text('Decks Dashboard Page'), findsOneWidget);
    });

    testWidgets('shows error container when login fails', (
      WidgetTester tester,
    ) async {
      mockAuthRepository.shouldFail = true;

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.pumpAndSettle();

      // Enter credentials
      final customInputs = find.byType(CustomInput);
      await tester.enterText(customInputs.at(0), 'kaiba');
      await tester.enterText(customInputs.at(1), 'wrongpass');

      // Tap Login
      await tester.tap(find.text('Login'));
      await tester.pump(); // Start request loading state
      await tester.pump(); // Finish future and update state with error
      await tester.pumpAndSettle();

      // Verify error display contains custom exception message
      expect(
        find.textContaining('Invalid username or password'),
        findsOneWidget,
      );
    });

    testWidgets('clicking register redirects to register screen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(mockAuthRepository),
          ],
          child: MaterialApp.router(routerConfig: router),
        ),
      );

      await tester.tap(find.text('Register here'));
      await tester.pumpAndSettle();

      expect(find.text('Register Page'), findsOneWidget);
    });

    testWidgets(
      'renders back button and clicking it goes to fallback route / home',
      (WidgetTester tester) async {
        router = GoRouter(
          initialLocation: '/login',
          routes: [
            GoRoute(
              path: '/login',
              builder: (context, state) => const LoginScreen(),
            ),
            GoRoute(
              path: '/',
              builder: (context, state) =>
                  const Scaffold(body: Text('Home Page')),
            ),
          ],
        );

        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        final backButton = find.byIcon(Icons.arrow_back);
        expect(backButton, findsOneWidget);

        await tester.tap(backButton);
        await tester.pumpAndSettle();

        expect(find.text('Home Page'), findsOneWidget);
      },
    );
  });
}
