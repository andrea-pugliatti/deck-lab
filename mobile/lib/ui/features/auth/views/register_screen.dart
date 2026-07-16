import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_input.dart';
import '../view_models/auth_provider.dart';

/// Form screen allowing users to create new accounts.
class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final notifier = ref.read(authProvider.notifier);
    await notifier.register(
      _usernameController.text.trim(),
      _emailController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    // Evaluate response state
    final authState = ref.read(authProvider);
    if (authState.hasValue && authState.value != null) {
      context.go(AppRoutes.home);
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
                        const SizedBox(height: 8),
                        Text(
                          'Create Account',
                          textAlign: .center,
                          style:
                              DeckLabTheme.darkTheme.textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Register to access and sync Yu-Gi-Oh! decks',
                          textAlign: .center,
                          style: TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                        const SizedBox(height: 48),

                        // Inputs
                        CustomInput(
                          label: 'Username',
                          placeholder: 'Enter a username',
                          controller: _usernameController,
                          prefixIcon: Icons.person_outline,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Username is required';
                            }
                            if (val.trim().length < 3) {
                              return 'Username must be at least 3 characters';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        CustomInput(
                          label: 'Email',
                          placeholder: 'Enter your email',
                          controller: _emailController,
                          prefixIcon: Icons.email_outlined,
                          keyboardType: .emailAddress,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Email is required';
                            }
                            final emailRegExp = RegExp(
                              r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                            );
                            if (!emailRegExp.hasMatch(val.trim())) {
                              return 'Please enter a valid email address';
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
                            if (val.length < 6) {
                              return 'Password must be at least 6 characters';
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
                          text: 'Register',
                          size: "lg",
                          isLoading: authState.isLoading,
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
                              "Already have an account?",
                              style: TextStyle(
                                color: Colors.white54,
                                fontSize: 13,
                              ),
                            ),
                            CustomButton(
                              text: "Login here",
                              variant: "outline-gold",
                              onPressed: () => context.go(AppRoutes.login),
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
