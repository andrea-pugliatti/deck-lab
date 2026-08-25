import { Component, type ErrorInfo, type ReactNode } from "react";

import ErrorAlert from "./ErrorAlert";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Root and route error boundary component to capture render exceptions gracefully
 * and prevent white screen crashes.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error captured by ErrorBoundary:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="mx-auto max-w-2xl px-6 py-16">
          <ErrorAlert
            title="Application Error"
            message={
              this.state.error?.message || "An unexpected error occurred while rendering the page."
            }
            onRetry={this.handleRetry}
            retryText="Reload Application"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
