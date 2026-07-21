import 'package:flutter/material.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';

class ActionToolbar extends StatelessWidget {
  final SimulatorState state;
  final SimulatorNotifier notifier;

  const ActionToolbar({super.key, required this.state, required this.notifier});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      alignment: .spaceBetween,
      crossAxisAlignment: .center,
      children: [
        Row(
          mainAxisSize: .min,
          children: [
            CustomButton(
              text: 'Reset',
              variant: 'outline',
              size: 'sm',
              onPressed: () => notifier.resetWorkspace(),
            ),
            const SizedBox(width: 8),
            CustomButton(
              text: 'Shuffle',
              variant: 'outline-gold',
              size: 'sm',
              onPressed: () => notifier.shuffle(),
            ),
          ],
        ),
        Row(
          mainAxisSize: .min,
          children: [
            CustomButton(
              text: 'Draw 1',
              variant: 'outline-cyan',
              size: 'sm',
              onPressed: () => notifier.drawCards(1),
            ),
            const SizedBox(width: 8),
            CustomButton(
              text: 'Draw Starting',
              variant: 'primary',
              size: 'sm',
              onPressed: () {
                notifier.resetWorkspace();
                notifier.drawCards(state.drawSize);
              },
            ),
          ],
        ),
      ],
    );
  }
}
