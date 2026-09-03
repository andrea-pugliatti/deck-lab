import React from "react";

/**
 * Props for the {@link Input} component.
 * Extends standard HTML input element attributes.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  containerClassName?: string;
}

/**
 * A highly styled text input component.
 * Supports an optional icon positioned on the left side of the input field
 * and applies glow focus borders.
 * Wraps the HTML `<input>` element with `React.forwardRef`.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", containerClassName = "", icon, disabled, ...props }, ref) => {
    return (
      <div
        className={`group bg-dark-surface-elevated border-border-dim hover:border-border-glow focus-within:border-cyan-accent focus-within:ring-cyan-accent/20 relative flex w-full items-center rounded border px-3 py-2 transition-all duration-300 focus-within:ring-2 ${containerClassName || className}`}
      >
        {icon && (
          <div className="group-focus-within:text-cyan-accent mr-2 shrink-0 text-slate-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full border-none bg-transparent text-sm text-white placeholder-slate-600 outline-none disabled:cursor-not-allowed disabled:opacity-50 ${containerClassName ? className : ""}`}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;
