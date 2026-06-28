import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`bg-dark-surface-elevated border-border-dim focus:border-cyan-accent h-20 w-full resize-none rounded border px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
export default Textarea;
