import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props },
    ref,
  ) => {
    // base styles
    const baseStyles =
      "flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none";

    // variant styles
    let variantStyles = "";
    if (variant === "primary") {
      variantStyles =
        "bg-gold-accent hover:bg-gold-hover text-dark-bg shadow-md hover:-translate-y-0.5";
    } else if (variant === "outline") {
      variantStyles =
        "border border-border-dim hover:border-cyan-accent text-slate-300 hover:text-cyan-accent bg-dark-surface-elevated";
    } else if (variant === "ghost") {
      variantStyles = "text-slate-400 hover:text-white hover:bg-dark-surface-elevated/40";
    }

    // size styles
    let sizeStyles = "";
    if (size === "sm") {
      sizeStyles = "px-4 py-2 text-[10px]";
    } else if (size === "md") {
      sizeStyles = "px-6 py-2.5 text-xs";
    } else if (size === "lg") {
      sizeStyles = "px-8 py-3 text-sm";
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
