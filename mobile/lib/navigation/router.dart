import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../ui/core/theme/theme.dart';

/// Provider exposing declarative routes and guard logic managed by go_router.
final routerProvider = Provider<GoRouter>((ref) {
  final rootNavigatorKey = GlobalKey<NavigatorState>();
  final shellNavigatorKey = GlobalKey<NavigatorState>();

  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: '/',
    redirect: (context, state) {
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
            path: '/',
            // builder: (context, state) => const HomeScreen(),
            builder: (context, state) => const EmptyWidget(),
          ),
          GoRoute(
            path: '/decks',
            // builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/cards',
            // builder: (context, state) => const CardDbScreen(),
          ),
          GoRoute(
            path: '/simulator',
            // builder: (context, state) => const HandSimulatorScreen(),
          ),
        ],
      ),
      // Overlay routes without Nav tabs
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/login',
        // builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/register',
        // builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/decks/create',
        // builder: (context, state) => const DeckBuilderScreen(deckId: null),
      ),
      GoRoute(
        parentNavigatorKey: rootNavigatorKey,
        path: '/decks/:id',
        // builder: (context, state) {
        //   final idStr = state.pathParameters['id']!;
        //   return DeckDetailScreen(deckId: int.parse(idStr));
        // },
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
        path: '/cards/:id',
        // builder: (context, state) {
        //   final idStr = state.pathParameters['id']!;
        //   return CardDetailScreen(cardId: int.parse(idStr));
        // },
      ),
    ],
  );
});

/// Private scaffold widget housing the persistent Bottom Navigation Bar.
class _ShellScaffold extends StatelessWidget {
  final GoRouterState state;
  final Widget child;

  const _ShellScaffold({required this.state, required this.child});

  @override
  Widget build(BuildContext context) {
    final activeIndex = switch (state.matchedLocation) {
      '/decks' => 1,
      '/cards' => 2,
      '/simulator' => 3,
      _ => 0,
    };

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: activeIndex,
        onTap: (index) {
          final targetPath = switch (index) {
            0 => '/',
            1 => '/decks',
            2 => '/cards',
            3 => '/simulator',
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
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
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

class EmptyWidget extends StatelessWidget {
  const EmptyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Hello'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: .center,
          children: [const Text('???')],
        ),
      ),
    );
  }
}
