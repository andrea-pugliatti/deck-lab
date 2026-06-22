import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-slate-500 block mb-1 font-semibold text-[10px] uppercase tracking-wider ${className}`}
        {...props}
      >
        {children}
      </label>
    );
  },
);
Label.displayName = "Label";
export default Label;
