import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_input.dart';
import '../view_models/auth_provider.dart';

/// Form screen allowing users to authenticate.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final notifier = ref.read(authProvider.notifier);
    await notifier.login(
      _usernameController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    // Evaluate response state
    final authState = ref.read(authProvider);
    if (authState.hasValue && authState.value != null) {
      final state = GoRouterState.of(context);
      final from = state.uri.queryParameters['from'];
      if (from != null) {
        context.go(from);
      } else if (context.canPop()) {
        context.pop();
      } else {
        context.go(AppRoutes.home);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const .all(24.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisAlignment: .center,
                      crossAxisAlignment: .stretch,
                      children: [
                        // Brand Logo mapping
                        const Image(
                          image: AssetImage('assets/images/logo.webp'),
                          height: 112,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'DeckLab',
                          textAlign: .center,
                          style: DeckLabTheme.darkTheme.textTheme.headlineLarge!
                              .copyWith(color: DeckLabTheme.goldAccent),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Sign in to access and sync your decks',
                          textAlign: .center,
                          style: TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                        const SizedBox(height: 48),

                        // Inputs
                        CustomInput(
                          label: 'Username',
                          placeholder: 'Enter your username',
                          controller: _usernameController,
                          prefixIcon: Icons.person_outline,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Username is required';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        CustomInput(
                          label: 'Password',
                          placeholder: 'Enter your password',
                          controller: _passwordController,
                          prefixIcon: Icons.lock_outline,
                          isPassword: true,
                          textInputAction: .done,
                          validator: (val) {
                            if (val == null || val.isEmpty) {
                              return 'Password is required';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),

                        // Error presentation panel
                        if (authState.hasError) ...[
                          Container(
                            padding: const .symmetric(
                              vertical: 10,
                              horizontal: 14,
                            ),
                            decoration: BoxDecoration(
                              color: DeckLabTheme.errorAccent.withValues(
                                alpha: 0.1,
                              ),
                              border: .all(
                                color: DeckLabTheme.errorAccent.withValues(
                                  alpha: 0.3,
                                ),
                              ),
                              borderRadius: .circular(8),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.error_outline,
                                  color: DeckLabTheme.errorAccent,
                                  size: 16,
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    authState.error.toString(),
                                    style: const TextStyle(
                                      color: DeckLabTheme.errorAccent,
                                      fontSize: 12,
                                      fontWeight: .w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Action buttons
                        CustomButton(
                          text: 'Login',
                          isLoading: authState.isLoading,
                          size: "lg",
                          onPressed: _submit,
                        ),
                        const SizedBox(height: 24),

                        // Redirect links
                        Wrap(
                          alignment: .center,
                          runAlignment: .center,
                          crossAxisAlignment: .center,
                          spacing: 8,
                          direction: .vertical,
                          children: [
                            const Text(
                              "Don't have an account?",
                              style: TextStyle(
                                color: Colors.white54,
                                fontSize: 13,
                              ),
                            ),
                            CustomButton(
                              text: "Register here",
                              variant: "outline-gold",
                              onPressed: () => context.go(AppRoutes.register),
                            ),
                            CustomButton(
                              text: "Browse as guest",
                              variant: "outline-cyan",
                              onPressed: () => context.go(AppRoutes.home),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 8,
              left: 8,
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white70),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go(AppRoutes.home);
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
