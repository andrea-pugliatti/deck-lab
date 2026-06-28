import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`mb-1 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase ${className}`}
        {...props}
      >
        {children}
      </label>
    );
  },
);
Label.displayName = "Label";
export default Label;
