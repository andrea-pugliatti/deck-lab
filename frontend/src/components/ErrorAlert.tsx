interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorAlert({
  title = "An error occurred",
  message,
  onRetry,
  retryText = "Retry",
}: ErrorAlertProps) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-red-500/20 bg-red-950/10 p-6 py-12 text-center">
      <p className="mb-2 font-semibold text-red-400">{title}</p>
      <p className="mb-4 text-xs text-slate-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="cursor-pointer rounded border border-red-500/50 bg-red-500/20 px-4 py-2 text-xs text-red-200 transition-colors duration-200 hover:bg-red-500/40"
          type="button"
        >
          {retryText}
        </button>
      )}
    </div>
  );
}
