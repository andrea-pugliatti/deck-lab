import React from "react";

/**
 * Props for the {@link Select} component.
 * Extends standard HTML select element attributes.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * A highly styled dropdown selector component.
 * Uses consistent dark styling and glow accents on focus.
 * Wraps the HTML `<select>` element with `React.forwardRef`.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`bg-dark-surface-elevated border-border-dim focus:border-cyan-accent w-full cursor-pointer rounded border px-3 py-2 text-sm text-slate-200 outline-none disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
export default Select;
