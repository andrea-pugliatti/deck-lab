import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../ui/core/theme/theme.dart';
import '../ui/features/auth/view_models/auth_provider.dart';
import '../ui/features/auth/views/login_screen.dart';
import '../ui/features/auth/views/register_screen.dart';
import '../ui/features/cards/views/card_db_screen.dart';
import '../ui/features/cards/views/card_detail_screen.dart';
import '../ui/features/dashboard/views/dashboard_screen.dart';
import '../ui/features/dashboard/views/deck_detail_screen.dart';
import '../ui/features/simulator/views/hand_simulator_screen.dart';
import 'routes.dart';

/// Provider exposing declarative routes and guard logic managed by go_router.
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);
  final rootNavigatorKey = GlobalKey<NavigatorState>();
  final shellNavigatorKey = GlobalKey<NavigatorState>();

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: AppRoutes.home,
    redirect: (context, state) {
      final loggedIn = authState.value != null;
      final isAuthScreen =
          state.matchedLocation == AppRoutes.login ||
          state.matchedLocation == AppRoutes.register;

      // Guard authenticated builder paths
      if (!loggedIn) {
        final requiresAuth =
            state.matchedLocation.contains(AppRoutes.deckCreate) ||
            state.matchedLocation.endsWith('/edit') ||
            state.matchedLocation == AppRoutes.simulator;
        if (requiresAuth) {
          final encodedLocation = Uri.encodeComponent(state.matchedLocation);
          return '${AppRoutes.login}?from=$encodedLocation';
        }
      } else {
        if (isAuthScreen) {
          final from = state.uri.queryParameters['from'];
          return from ?? AppRoutes.home;
        }
      }
      return null;
    },
    routes: [
      // Wrapper for Bottom Navigation tabs
      ShellRoute(
        navigatorKey: shellNavigatorKey,
        builder: (context, state, child) {
          return _ShellScaffold(state: state, child: child);
        },
        routes: [
          GoRoute(
            path: AppRoutes.home,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: DashboardScreen()),
          ),
          GoRoute(
            path: AppRoutes.cards,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: CardDbScreen()),
          ),
          GoRoute(
            path: AppRoutes.simulator,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: HandSimulatorScreen()),
          ),
        ],
      ),
      // Overlay routes without Nav tabs
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.login,
        pageBuilder: (context, state) =>
            _fadeTransitionPage(key: state.pageKey, child: const LoginScreen()),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.register,
        pageBuilder: (context, state) => _fadeTransitionPage(
          key: state.pageKey,
          child: const RegisterScreen(),
        ),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/decks/create',
        // builder: (context, state) => const DeckBuilderScreen(deckId: null),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.deckDetailPattern,
        pageBuilder: (context, state) {
          final idStr = state.pathParameters['id']!;
          return _fadeTransitionPage(
            key: state.pageKey,
            child: DeckDetailScreen(deckId: int.parse(idStr)),
          );
        },
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/decks/:id/edit',
        // builder: (context, state) {
        //   final idStr = state.pathParameters['id']!;
        //   return DeckBuilderScreen(deckId: int.parse(idStr));
        // },
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.cardDetailPattern,
        pageBuilder: (context, state) {
          final idStr = state.pathParameters['id']!;
          return _fadeTransitionPage(
            key: state.pageKey,
            child: CardDetailScreen(cardId: int.parse(idStr)),
          );
        },
      ),
    ],
  );
});

Page<dynamic> _fadeTransitionPage({
  required LocalKey key,
  required Widget child,
}) {
  return CustomTransitionPage<void>(
    key: key,
    child: child,
    transitionDuration: const Duration(milliseconds: 200),
    reverseTransitionDuration: const Duration(milliseconds: 150),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: CurveTween(curve: Curves.easeInOut).animate(animation),
        child: child,
      );
    },
  );
}

/// Private scaffold widget housing the persistent Bottom Navigation Bar.
class _ShellScaffold extends StatelessWidget {
  final GoRouterState state;
  final Widget child;

  const _ShellScaffold({required this.state, required this.child});

  @override
  Widget build(BuildContext context) {
    final activeIndex = switch (state.matchedLocation) {
      AppRoutes.cards => 1,
      AppRoutes.simulator => 2,
      _ => 0,
    };

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: activeIndex,
        onTap: (index) {
          final targetPath = switch (index) {
            0 => AppRoutes.home,
            1 => AppRoutes.cards,
            2 => AppRoutes.simulator,
            _ => null,
          };
          if (targetPath != null) {
            context.go(targetPath);
          }
        },
        backgroundColor: DeckLabTheme.darkSurface,
        selectedItemColor: DeckLabTheme.goldAccent,
        unselectedItemColor: Colors.white38,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.layers_outlined),
            activeIcon: Icon(Icons.layers),
            label: 'Decks',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            activeIcon: Icon(Icons.search_rounded),
            label: 'Cards',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.casino_outlined),
            activeIcon: Icon(Icons.casino),
            label: 'Simulator',
          ),
        ],
      ),
    );
  }
}
