"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Something went wrong</h3>
            <p className="text-xs text-red-600/80 dark:text-red-400/80">
              The component failed to render. This might be due to an invalid artifact or a temporary glitch.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            <RefreshCcw size={14} />
            <span>Try again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
