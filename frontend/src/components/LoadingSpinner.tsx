interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  let spinnerSize = "w-10 h-10 border-4";
  if (size === "sm") {
    spinnerSize = "w-6 h-6 border-2";
  } else if (size === "lg") {
    spinnerSize = "w-12 h-12 border-4";
  }

  return (
    <div className={`flex justify-center items-center py-20 ${className}`}>
      <div
        className={`${spinnerSize} border-cyan-accent/20 border-t-cyan-accent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
