import { AlertTriangle, HelpCircle, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import Button from "./Button";

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

  return (
    <dialog
      ref={dialogRef}
      className="bg-transparent text-white p-4 border-none backdrop:bg-black/75 backdrop:backdrop-blur-sm focus:outline-none max-w-md w-full max-h-[90vh] overflow-visible"
    >
      <div className="bg-dark-surface border border-border-dim rounded-2xl p-6 shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow effect based on variant */}
        <div
          className={`absolute inset-0 bg-radial ${radialAccentClass} via-transparent to-transparent pointer-events-none`}
        ></div>

        <div className="flex items-start gap-4 mb-6 relative z-10">
          <div
            className={`p-3 bg-dark-surface-elevated rounded-xl border border-border-dim/60 ${iconColorClass} shrink-0`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-slate-100 mb-1.5 leading-tight">
              {title}
            </h3>
            <div className="text-sm text-slate-400 font-light leading-relaxed">{description}</div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated"
            disabled={isLoading}
            onClick={() => dialogRef.current?.close()}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 relative z-10 justify-end">
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
