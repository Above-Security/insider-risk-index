'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('error_boundary_triggered', {
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <Card className="max-w-2xl w-full shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                <CardTitle className="text-2xl">Something went wrong</CardTitle>
              </div>
              <CardDescription>
                We've encountered an unexpected error. The error has been logged and our team will investigate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="mt-2">
                  <code className="text-sm font-mono">
                    {this.state.error?.message || 'Unknown error occurred'}
                  </code>
                </AlertDescription>
              </Alert>

              {isDevelopment && this.state.error?.stack && (
                <details className="space-y-2">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Developer Details (Development Only)
                  </summary>
                  <pre className="p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
                      Component Stack:
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Async Error Boundary for Server Components
export function AsyncErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}