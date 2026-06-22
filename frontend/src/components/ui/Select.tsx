import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-sm text-slate-200 w-full outline-none focus:border-cyan-accent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
export default Select;
