import React from "react";

/**
 * Props for the {@link Badge} component.
 * Extends the default HTML span element attributes.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "cyan" | "purple" | "spell" | "trap" | "monster";
}

/**
 * A highly styled badge/tag component for displaying metadata, classifications, or card types.
 * Supports forward ref to the underlying HTML span element.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles =
      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border select-none";

    let variantStyles = "";
    switch (variant) {
      case "gold":
        variantStyles = "text-gold-accent bg-gold-accent/10 border-gold-accent/20";
        break;
      case "cyan":
        variantStyles = "text-cyan-accent bg-cyan-accent/10 border-cyan-accent/20";
        break;
      case "purple":
        variantStyles = "text-purple-400 bg-purple-400/10 border-purple-400/20";
        break;
      case "spell":
        variantStyles = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        break;
      case "trap":
        variantStyles = "text-rose-400 bg-rose-500/10 border-rose-500/20";
        break;
      case "monster":
        variantStyles = "text-amber-400 bg-amber-500/10 border-amber-500/20";
        break;
      case "default":
      default:
        variantStyles = "text-slate-400 bg-dark-surface-elevated border-border-dim";
        break;
    }

    return (
      <span ref={ref} className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";
export default Badge;
