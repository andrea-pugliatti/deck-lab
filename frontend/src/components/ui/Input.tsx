import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, disabled, ...props }, ref) => {
    if (icon) {
      return (
        <div
          className={`group relative flex items-center bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 w-full transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent ${className}`}
        >
          <div className="text-slate-500 mr-2 group-focus-within:text-cyan-accent shrink-0">
            {icon}
          </div>
          <input
            ref={ref}
            disabled={disabled}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-sm text-white w-full outline-none focus:border-cyan-accent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
export default Input;
