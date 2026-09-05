import React, { useEffect, useRef } from "react";

export type { ModalCloseButtonProps } from "./ModalCloseButton";
export { default as ModalCloseButton } from "./ModalCloseButton";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-full",
};

/**
 * Props for the {@link Modal} component.
 */
export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
  containerClassName?: string;
  closeOnBackdropClick?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

/**
 * A reusable modal dialog primitive built using the native HTML `<dialog>` element.
 * Encapsulates modal show/close lifecycle, keyboard accessibility (Escape key handling),
 * backdrop blur styling, responsive container constraints, and backdrop click handling.
 */
export default function Modal({
  isOpen = true,
  onClose,
  children,
  size = "md",
  className = "",
  containerClassName = "",
  closeOnBackdropClick = true,
  ariaLabel,
  ariaLabelledBy,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdropClick && e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`max-h-[90vh] w-full ${sizeClasses[size]} overflow-visible border-none bg-transparent p-4 text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm focus-visible:outline-hidden ${className}`}
    >
      <div
        className={`bg-dark-surface border-border-dim relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border shadow-2xl ${containerClassName}`}
      >
        {children}
      </div>
    </dialog>
  );
}
