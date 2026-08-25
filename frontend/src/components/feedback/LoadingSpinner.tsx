/**
 * Props for the {@link LoadingSpinner} component.
 */
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A standard animated loading spinner component.
 * Uses a cyan accent border-spin animation, centered within its container.
 */
export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  let spinnerSize = "w-10 h-10 border-4";
  if (size === "sm") {
    spinnerSize = "w-6 h-6 border-2";
  } else if (size === "lg") {
    spinnerSize = "w-12 h-12 border-4";
  }

  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div
        className={`${spinnerSize} border-cyan-accent/20 border-t-cyan-accent animate-spin rounded-full`}
      ></div>
    </div>
  );
}
