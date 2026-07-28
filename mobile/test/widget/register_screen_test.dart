import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/core/widgets/custom_input.dart';
import 'package:mobile/ui/features/auth/views/register_screen.dart';

import '../helpers/mock_repositories.dart';

void main() {
  group('RegisterScreen Widget Tests', () {
    late MockAuthRepository mockAuthRepository;
    late GoRouter router;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      mockAuthRepository.silentLoginResult = null;

      router = GoRouter(
        initialLocation: '/register',
        routes: [
          GoRoute(
            path: '/register',
            builder: (context, state) => const RegisterScreen(),
          ),
          GoRoute(
            path: '/',
            builder: (context, state) =>
                const Scaffold(body: Text('Decks Dashboard Page')),
          ),
          GoRoute(
            path: '/login',
            builder: (context, state) =>
                const Scaffold(body: Text('Login Page')),
          ),
        ],
      );
    });

    testWidgets('renders all fields and enforces inputs validation rules', (
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
      expect(find.text('Create Account'), findsOneWidget);

      // Submit immediately
      final registerBtn = find.text('Register');
      await tester.ensureVisible(registerBtn);
      await tester.tap(registerBtn);
      await tester.pumpAndSettle();

      expect(find.text('Username is required'), findsOneWidget);
      expect(find.text('Email is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);

      // Fill invalid data and submit
      final customInputs = find.byType(CustomInput);
      await tester.enterText(customInputs.at(0), 'ka'); // too short
      await tester.enterText(customInputs.at(1), 'invalid-email'); // bad format
      await tester.enterText(customInputs.at(2), '123'); // too short password

      await tester.ensureVisible(registerBtn);
      await tester.tap(registerBtn);
      await tester.pumpAndSettle();

      expect(
        find.text('Username must be at least 3 characters'),
        findsOneWidget,
      );
      expect(find.text('Please enter a valid email address'), findsOneWidget);
      expect(
        find.text('Password must be at least 6 characters'),
        findsOneWidget,
      );
    });

    testWidgets(
      'submits registration details and routes to /decks on success',
      (WidgetTester tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              authRepositoryProvider.overrideWithValue(mockAuthRepository),
            ],
            child: MaterialApp.router(routerConfig: router),
          ),
        );

        await tester.pumpAndSettle();

        final customInputs = find.byType(CustomInput);
        await tester.enterText(customInputs.at(0), 'kaiba');
        await tester.enterText(customInputs.at(1), 'kaiba@duelacademy.com');
        await tester.enterText(customInputs.at(2), 'blueeyes');

        final registerBtn = find.text('Register');
        await tester.ensureVisible(registerBtn);
        await tester.tap(registerBtn);
        await tester.pumpAndSettle();

        expect(find.text('Decks Dashboard Page'), findsOneWidget);
      },
    );

    testWidgets('shows failure alert container when server rejects registry', (
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

      final customInputs = find.byType(CustomInput);
      await tester.enterText(customInputs.at(0), 'kaiba');
      await tester.enterText(customInputs.at(1), 'kaiba@duelacademy.com');
      await tester.enterText(customInputs.at(2), 'blueeyes');

      final registerBtn = find.text('Register');
      await tester.ensureVisible(registerBtn);
      await tester.tap(registerBtn);
      await tester.pump();
      await tester.pump();
      await tester.pumpAndSettle();

      expect(find.textContaining('Registration failed'), findsOneWidget);
    });

    testWidgets('clicking login redirect navigates to /login', (
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

      final loginHereBtn = find.text('Login here');
      await tester.ensureVisible(loginHereBtn);
      await tester.tap(loginHereBtn);
      await tester.pumpAndSettle();

      expect(find.text('Login Page'), findsOneWidget);
    });

    testWidgets(
      'renders back button and clicking it goes to fallback route / home',
      (WidgetTester tester) async {
        router = GoRouter(
          initialLocation: '/register',
          routes: [
            GoRoute(
              path: '/register',
              builder: (context, state) => const RegisterScreen(),
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
