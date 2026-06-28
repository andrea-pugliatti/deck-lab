import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, disabled, ...props }, ref) => {
    if (icon) {
      return (
        <div
          className={`group bg-dark-surface-elevated border-border-dim hover:border-border-glow focus-within:border-cyan-accent relative flex w-full items-center rounded border px-3 py-2 transition-all duration-300 ${className}`}
        >
          <div className="group-focus-within:text-cyan-accent mr-2 shrink-0 text-slate-500">
            {icon}
          </div>
          <input
            ref={ref}
            disabled={disabled}
            className="w-full border-none bg-transparent text-sm text-white placeholder-slate-600 outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`bg-dark-surface-elevated border-border-dim focus:border-cyan-accent w-full rounded border px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
export default Input;
