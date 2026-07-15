import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered in place of children when an error is caught. */
  fallback: ReactNode;
  /**
   * Called with the caught error for reporting to the centralized error
   * tracker (21 - Frontend Architecture.md §11, scrubbed of PII per
   * 11 - Security.md §13). Left as an injected callback rather than a direct
   * tracker import, so this component has no dependency on which tracking
   * service is eventually wired in.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Generic error boundary. Per 21 - Frontend Architecture.md §11, one instance
 * wraps each major layout (BuyerLayout, StaffLayout — built in M3) so surrounding
 * chrome survives a rendering error in the content area. This boundary only
 * catches rendering errors; async/fetch errors are handled by TanStack Query's
 * own error state, not here.
 *
 * This is infrastructure, not a feature or design-system component, so it's
 * in scope for Sprint 1 alongside the other explicitly-requested providers.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
