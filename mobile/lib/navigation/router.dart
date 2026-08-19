import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../ui/core/theme/theme.dart';
import '../ui/features/auth/view_models/auth_provider.dart';
import '../ui/features/auth/views/login_screen.dart';
import '../ui/features/auth/views/register_screen.dart';
import '../ui/features/cards/views/card_db_screen.dart';
import '../ui/features/cards/views/card_detail_screen.dart';
import '../ui/features/decks/views/decks_screen.dart';
import '../ui/features/decks/views/deck_detail_screen.dart';
import '../ui/features/deck_builder/views/deck_builder_screen.dart';
import '../ui/features/simulator/views/hand_simulator_screen.dart';
import 'routes.dart';

final rootNavigatorKey = GlobalKey<NavigatorState>();
final shellNavigatorKey = GlobalKey<NavigatorState>();

/// Listenable bridge notifying GoRouter on Riverpod auth state updates.
class RouterNotifier extends ChangeNotifier {
  final Ref _ref;

  RouterNotifier(this._ref) {
    _ref.listen<AsyncValue<dynamic>>(
      authProvider,
      (previous, next) => notifyListeners(),
    );
  }
}

final routerNotifierProvider = Provider<RouterNotifier>((ref) => RouterNotifier(ref));

/// Provider exposing declarative routes and guard logic managed by go_router.
final routerProvider = Provider<GoRouter>((ref) {
  final notifier = ref.watch(routerNotifierProvider);

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    refreshListenable: notifier,
    initialLocation: AppRoutes.home,
    redirect: (context, state) {
      final authState = ref.read(authProvider);
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
      // Persistent IndexedStack for Bottom Navigation tabs
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return _StatefulShellScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.home,
                pageBuilder: (context, state) =>
                    const NoTransitionPage(child: DecksScreen()),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.cards,
                pageBuilder: (context, state) =>
                    const NoTransitionPage(child: CardDbScreen()),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.simulator,
                pageBuilder: (context, state) =>
                    const NoTransitionPage(child: HandSimulatorScreen()),
              ),
            ],
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
        path: AppRoutes.deckCreate,
        pageBuilder: (context, state) => _fadeTransitionPage(
          key: state.pageKey,
          child: const DeckBuilderScreen(deckId: null),
        ),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.deckDetailPattern,
        pageBuilder: (context, state) {
          final idStr = state.pathParameters['id'] ?? '';
          final id = int.tryParse(idStr);
          if (id == null) {
            return _fadeTransitionPage(
              key: state.pageKey,
              child: const Scaffold(
                body: Center(child: Text('Invalid Deck ID')),
              ),
            );
          }
          return _fadeTransitionPage(
            key: state.pageKey,
            child: DeckDetailScreen(deckId: id),
          );
        },
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.deckEditPattern,
        pageBuilder: (context, state) {
          final idStr = state.pathParameters['id'] ?? '';
          final id = int.tryParse(idStr);
          if (id == null) {
            return _fadeTransitionPage(
              key: state.pageKey,
              child: const Scaffold(
                body: Center(child: Text('Invalid Deck ID')),
              ),
            );
          }
          return _fadeTransitionPage(
            key: state.pageKey,
            child: DeckBuilderScreen(deckId: id),
          );
        },
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: AppRoutes.cardDetailPattern,
        pageBuilder: (context, state) {
          final idStr = state.pathParameters['id'] ?? '';
          final id = int.tryParse(idStr);
          if (id == null) {
            return _fadeTransitionPage(
              key: state.pageKey,
              child: const Scaffold(
                body: Center(child: Text('Invalid Card ID')),
              ),
            );
          }
          return _fadeTransitionPage(
            key: state.pageKey,
            child: CardDetailScreen(cardId: id),
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

/// Private scaffold widget housing the persistent Bottom Navigation Bar with IndexedStack tabs.
class _StatefulShellScaffold extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const _StatefulShellScaffold({required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
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
