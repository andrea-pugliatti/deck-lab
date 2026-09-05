import { X } from "lucide-react";
import React from "react";

/**
 * Props for the {@link ModalCloseButton} component.
 */
export interface ModalCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
  iconSize?: "sm" | "md";
}

/**
 * Accessible close button styled for modals and dialogs.
 */
export default function ModalCloseButton({
  onClose,
  onClick,
  iconSize = "md",
  className = "",
  disabled,
  ...props
}: ModalCloseButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      onClose?.();
    }
  };

  return (
    <button
      type="button"
      aria-label="Close dialog"
      onClick={handleClick}
      disabled={disabled}
      className={`bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated focus-visible:ring-cyan-accent cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      <X className={iconSize === "sm" ? "size-4" : "size-5"} aria-hidden="true" />
    </button>
  );
}

export { ModalCloseButton };
