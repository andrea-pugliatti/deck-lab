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
    <div className="text-center py-12 bg-red-950/10 border border-red-500/20 rounded-lg p-6 max-w-xl mx-auto">
      <p className="text-red-400 font-semibold mb-2">{title}</p>
      <p className="text-xs text-slate-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50 rounded text-xs transition-colors duration-200 cursor-pointer"
          type="button"
        >
          {retryText}
        </button>
      )}
    </div>
  );
}
