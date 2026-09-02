import React from "react";

/**
 * Props for the {@link Textarea} component.
 * Extends standard HTML textarea element attributes.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * A highly styled multi-line text input (textarea) component.
 * Features fixed heights, disabled resize, and focus glow styling.
 * Wraps the HTML `<textarea>` element with `React.forwardRef`.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`bg-dark-surface-elevated border-border-dim focus:border-cyan-accent focus-visible:ring-cyan-accent/20 h-20 w-full resize-none rounded border px-3 py-2 text-sm text-white outline-none focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
export default Textarea;
