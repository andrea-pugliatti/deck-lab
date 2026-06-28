import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "outline"
    | "outline-cyan"
    | "outline-gold"
    | "outline-purple"
    | "outline-red"
    | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export interface ButtonStyleProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export const getButtonClasses = ({ variant = "primary", size = "md" }: ButtonStyleProps = {}) => {
  // base styles
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none";

  // variant styles
  let variantStyles = "";
  if (variant === "primary") {
    variantStyles =
      "bg-gold-accent hover:bg-gold-hover text-dark-bg shadow-md hover:shadow-[0_2px_30px_rgba(226,197,111,0.16)]";
  } else if (variant === "outline") {
    variantStyles =
      "border border-border-dim hover:border-cyan-accent text-slate-300 hover:text-cyan-accent bg-dark-surface-elevated";
  } else if (variant === "outline-cyan") {
    variantStyles =
      "border border-cyan-accent/20 hover:border-cyan-accent text-cyan-accent hover:text-dark-bg bg-cyan-accent/15 hover:bg-cyan-accent";
  } else if (variant === "outline-gold") {
    variantStyles =
      "border border-gold-accent/20 hover:border-gold-accent text-gold-accent hover:text-dark-bg bg-gold-accent/15 hover:bg-gold-accent";
  } else if (variant === "outline-purple") {
    variantStyles =
      "border border-purple-500/20 hover:border-purple-500 text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500";
  } else if (variant === "outline-red") {
    variantStyles =
      "border border-red-500/20 hover:border-red-500/50 text-slate-400 hover:text-red-400 bg-red-950/20 hover:bg-red-950/40";
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
  } else if (size === "icon") {
    sizeStyles = "p-2 h-9 w-9 min-w-0 flex items-center justify-center";
  }

  return `${baseStyles} ${variantStyles} ${sizeStyles}`;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${getButtonClasses({ variant, size })} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
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
