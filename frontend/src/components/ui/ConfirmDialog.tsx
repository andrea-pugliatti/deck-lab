import { AlertTriangle, HelpCircle, X } from "lucide-react";
import React, { useEffect, useRef } from "react";

import Button from "./Button";

/**
 * Props for the {@link ConfirmDialog} component.
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "primary";
  isLoading?: boolean;
}

/**
 * A modal dialog component for requesting user confirmation.
 * Built using the HTML `<dialog>` element, fully keyboard accessible,
 * supports backdrop blur, theme styling (info, danger, warning), and loading states.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
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

  // Determine button variants and icons based on dialog variant
  let confirmButtonVariant:
    | "primary"
    | "outline"
    | "outline-cyan"
    | "outline-gold"
    | "outline-purple"
    | "outline-red"
    | "ghost" = "primary";

  let Icon = HelpCircle;
  let iconColorClass = "text-cyan-accent";
  let radialAccentClass = "from-cyan-accent/5";

  if (variant === "danger") {
    confirmButtonVariant = "outline-red";
    Icon = AlertTriangle;
    iconColorClass = "text-red-400";
    radialAccentClass = "from-red-500/5";
  } else if (variant === "warning") {
    confirmButtonVariant = "outline-gold";
    Icon = AlertTriangle;
    iconColorClass = "text-gold-accent";
    radialAccentClass = "from-gold-accent/5";
  } else if (variant === "info") {
    confirmButtonVariant = "outline-cyan";
    Icon = HelpCircle;
    iconColorClass = "text-cyan-accent";
    radialAccentClass = "from-cyan-accent/5";
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="max-h-[90vh] w-full max-w-md overflow-visible border-none bg-transparent p-4 text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm focus:outline-none"
    >
      <div className="bg-dark-surface border-border-dim animate-in fade-in zoom-in-95 relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-2xl duration-200">
        {/* Glow effect based on variant */}
        <div
          className={`absolute inset-0 bg-radial ${radialAccentClass} pointer-events-none via-transparent to-transparent`}
        ></div>

        <div className="relative z-10 mb-6 flex items-start gap-4">
          <div
            className={`bg-dark-surface-elevated border-border-dim/60 rounded-xl border p-3 ${iconColorClass} shrink-0`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display mb-1.5 text-lg leading-tight font-bold text-slate-100">
              {title}
            </h3>
            <div className="text-sm leading-relaxed font-light text-slate-400">{description}</div>
          </div>
          <button
            type="button"
            className="bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:text-white"
            disabled={isLoading}
            onClick={() => dialogRef.current?.close()}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-10 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => dialogRef.current?.close()}
            disabled={isLoading}
            size="md"
            className="flex-1 sm:flex-initial"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmButtonVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            size="md"
            className="flex-1 sm:flex-initial"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
