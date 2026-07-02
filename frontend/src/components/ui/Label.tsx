import React from "react";

/**
 * Props for the {@link Label} component.
 * Extends standard HTML label element attributes.
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * A highly styled text label component for forms.
 * Displays as a bold uppercase text, matching the theme design tokens.
 * Wraps the HTML `<label>` element with `React.forwardRef`.
 */
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
