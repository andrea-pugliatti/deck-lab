import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/enums/enums.dart';
import '../../../../domain/models/strategy_option.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_input.dart';
import '../../cards/view_models/card_db_provider.dart';
import '../view_models/deck_builder_provider.dart';
import 'generating_state.dart';

/// Interactive modal sheet guiding user deck generation using AI capabilities.
class AiWizardModal extends ConsumerStatefulWidget {
  const AiWizardModal({super.key});

  /// Displays the wizard bottom sheet overlay.
  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const AiWizardModal(),
    );
  }

  @override
  ConsumerState<AiWizardModal> createState() => _AiWizardModalState();
}

class _AiWizardModalState extends ConsumerState<AiWizardModal> {
  final _formKey = GlobalKey<FormState>();
  final _archetypeController = TextEditingController();
  final _promptController = TextEditingController();
  Strategy _strategy = Strategy.none;
  bool _isLoading = false;

  @override
  void dispose() {
    _archetypeController.dispose();
    _promptController.dispose();
    super.dispose();
  }

  void _generate() async {
    if (!_formKey.currentState!.validate()) return;
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    final notifier = ref.read(deckBuilderProvider.notifier);

    try {
      await notifier.triggerAiGeneration(
        archetype: _archetypeController.text.trim(),
        strategy: _strategy,
        customPrompt: _promptController.text.trim().isNotEmpty
            ? _promptController.text.trim()
            : null,
      );
      if (mounted) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final archetypesAsync = ref.watch(cardArchetypesProvider);
    final archetypes = archetypesAsync.value ?? [];
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return Container(
      margin: const .only(top: 64),
      padding: .only(left: 20, right: 20, top: 20, bottom: 20 + bottomInset),
      decoration: const BoxDecoration(
        color: DeckLabTheme.darkSurface,
        borderRadius: .vertical(top: .circular(20)),
        border: Border(top: BorderSide(color: DeckLabTheme.borderDim)),
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: .min,
            crossAxisAlignment: .stretch,
            children: [
              // Header
              Row(
                mainAxisAlignment: .spaceBetween,
                children: [
                  Text(
                    'AI DECK GENERATOR',
                    style: tt.titleMedium!.copyWith(
                      color: cs.primary,
                      letterSpacing: 1.0,
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.close,
                      color: cs.onSurface.withValues(alpha: 0.54),
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Provide parameters below. The AI generator will compile, resolve database cards, and validate legality rules automatically.',
                style: tt.bodySmall!.copyWith(
                  color: cs.onSurface.withValues(alpha: 0.54),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),

              if (_isLoading) ...[
                const Padding(
                  padding: .symmetric(vertical: 36.0),
                  child: GeneratingState(),
                ),
              ] else ...[
                // Archetype
                Autocomplete<String>(
                  optionsBuilder: (TextEditingValue textEditingValue) {
                    if (textEditingValue.text.isEmpty) {
                      return const Iterable<String>.empty();
                    }
                    return archetypes.where((String option) {
                      return option.toLowerCase().contains(
                        textEditingValue.text.toLowerCase(),
                      );
                    });
                  },
                  onSelected: (String selection) {
                    _archetypeController.text = selection;
                  },
                  fieldViewBuilder:
                      (
                        context,
                        textEditingController,
                        focusNode,
                        onFieldSubmitted,
                      ) {
                        if (textEditingController.text !=
                            _archetypeController.text) {
                          textEditingController.text =
                              _archetypeController.text;
                        }
                        _archetypeController.addListener(() {
                          if (textEditingController.text !=
                              _archetypeController.text) {
                            textEditingController.text =
                                _archetypeController.text;
                          }
                        });
                        textEditingController.addListener(() {
                          _archetypeController.text =
                              textEditingController.text;
                        });

                        return CustomInput(
                          label: 'Archetype (e.g. Elemental HERO, Blue-Eyes)',
                          placeholder: 'Enter archetype name...',
                          controller: textEditingController,
                          prefixIcon: Icons.auto_awesome,
                          focusNode: focusNode,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Archetype is required';
                            }
                            return null;
                          },
                        );
                      },
                  optionsViewBuilder: (context, onSelected, options) {
                    return Align(
                      alignment: .topLeft,
                      child: Material(
                        color: Colors.transparent,
                        child: Container(
                          margin: const .only(top: 4),
                          width: MediaQuery.of(context).size.width - 40,
                          constraints: const BoxConstraints(maxHeight: 200),
                          decoration: BoxDecoration(
                            color: DeckLabTheme.darkSurface,
                            border: .all(color: DeckLabTheme.borderDim),
                            borderRadius: .circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.5),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ListView.builder(
                            padding: .zero,
                            shrinkWrap: true,
                            itemCount: options.length,
                            itemBuilder: (BuildContext context, int index) {
                              final String option = options.elementAt(index);
                              return InkWell(
                                onTap: () => onSelected(option),
                                child: Padding(
                                  padding: const .symmetric(
                                    horizontal: 16,
                                    vertical: 12,
                                  ),
                                  child: Text(
                                    option,
                                    style: tt.bodyMedium!.copyWith(
                                      color: cs.onSurface,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 20),

                // Strategy Select
                Text(
                  'Gameplay Strategy',
                  style: tt.labelMedium!.copyWith(
                    color: cs.primary,
                    fontWeight: .w600,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<Strategy>(
                  initialValue: _strategy,
                  style: tt.bodyMedium!.copyWith(color: cs.onSurface),
                  dropdownColor: DeckLabTheme.darkSurface,
                  decoration: const InputDecoration(
                    contentPadding: .symmetric(horizontal: 12, vertical: 10),
                  ),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        _strategy = val;
                      });
                    }
                  },
                  items: defaultStrategies.map((strat) {
                    return DropdownMenuItem<Strategy>(
                      value: strat.value,
                      child: Text(strat.label),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 6),
                Text(
                  defaultStrategies
                      .firstWhere(
                        (s) => s.value == _strategy,
                        orElse: () => defaultStrategies.first,
                      )
                      .description,
                  style: tt.bodySmall!.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.54),
                    fontStyle: .italic,
                  ),
                ),
                const SizedBox(height: 20),

                // Custom instructions
                CustomInput(
                  label: 'Custom Instructions (Optional)',
                  placeholder:
                      'e.g. Focus on Fusion summoning, do not include hand traps...',
                  controller: _promptController,
                  prefixIcon: Icons.edit_note,
                  keyboardType: .multiline,
                  textInputAction: .newline,
                ),
                const SizedBox(height: 32),

                // Confirm button
                CustomButton(
                  text: 'Generate Deck',
                  isLoading: _isLoading,
                  icon: const Icon(Icons.rocket_launch, size: 16),
                  onPressed: _generate,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
