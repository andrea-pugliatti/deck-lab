import { AlertTriangle, HelpCircle } from "lucide-react";
import React from "react";

import Button from "./Button";
import Modal from "./Modal";
import ModalCloseButton from "./ModalCloseButton";

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
 * Built using the shared `<Modal>` component, fully keyboard accessible,
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      containerClassName="animate-fade-in p-6"
      ariaLabel={title}
    >
      {/* Glow effect based on variant */}
      <div
        className={`absolute inset-0 bg-radial ${radialAccentClass} pointer-events-none via-transparent to-transparent`}
      ></div>

      <div className="relative z-10 mb-6 flex items-start gap-4">
        <div
          className={`bg-dark-surface-elevated border-border-dim/60 rounded-xl border p-3 ${iconColorClass} shrink-0`}
        >
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display mb-1.5 text-lg leading-tight font-bold text-slate-100">
            {title}
          </h3>
          <div className="text-sm leading-relaxed font-light text-slate-400">{description}</div>
        </div>
        <ModalCloseButton disabled={isLoading} onClick={onClose} iconSize="sm" />
      </div>

      <div className="relative z-10 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
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
    </Modal>
  );
}
