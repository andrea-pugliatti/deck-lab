import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'navigation/router.dart';
import 'ui/core/theme/theme.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

/// The root widget of the DeckLab mobile application.
///
/// Hooks up declarative routing using GoRouter and applies the theme.
class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'DeckLab',
      debugShowCheckedModeBanner: false,
      theme: DeckLabTheme.darkTheme,
      routerConfig: router,
    );
  }
}
