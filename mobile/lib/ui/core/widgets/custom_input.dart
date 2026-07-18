import 'package:flutter/material.dart';

/// Text form field.
class CustomInput extends StatefulWidget {
  final String label;
  final String? placeholder;
  final TextEditingController controller;
  final String? Function(String?)? validator;
  final IconData? prefixIcon;
  final bool isPassword;
  final TextInputType keyboardType;
  final TextInputAction textInputAction;
  final ValueChanged<String>? onChanged;
  final FocusNode? focusNode;

  const CustomInput({
    super.key,
    required this.label,
    this.placeholder,
    required this.controller,
    this.validator,
    this.prefixIcon,
    this.isPassword = false,
    this.keyboardType = .text,
    this.textInputAction = .next,
    this.onChanged,
    this.focusNode,
  });

  @override
  State<CustomInput> createState() => _CustomInputState();
}

class _CustomInputState extends State<CustomInput> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: .start,
      children: [
        Text(
          widget.label,
          style: tt.labelMedium!.copyWith(
            color: cs.primary,
            fontWeight: .w600,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: widget.controller,
          focusNode: widget.focusNode,
          validator: widget.validator,
          obscureText: widget.isPassword ? _obscureText : false,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          onChanged: widget.onChanged,
          style: tt.bodyMedium!.copyWith(color: cs.onSurface),
          decoration: InputDecoration(
            hintText: widget.placeholder,
            hintStyle: tt.bodyMedium!.copyWith(
              color: cs.onSurface.withValues(alpha: 0.38),
            ),
            prefixIcon: widget.prefixIcon != null
                ? Icon(
                    widget.prefixIcon,
                    color: cs.onSurface.withValues(alpha: 0.54),
                    size: 18,
                  )
                : null,
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      _obscureText ? Icons.visibility_off : Icons.visibility,
                      color: cs.onSurface.withValues(alpha: 0.54),
                      size: 18,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscureText = !_obscureText;
                      });
                    },
                  )
                : null,
          ),
        ),
      ],
    );
  }
}
