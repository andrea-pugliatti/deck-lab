import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

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
