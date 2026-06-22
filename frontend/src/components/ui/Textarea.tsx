import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-sm text-white w-full h-20 outline-none focus:border-cyan-accent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
export default Textarea;
