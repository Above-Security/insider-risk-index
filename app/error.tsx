'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
    
    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('application_error', {
        error: error.message,
        digest: error.digest,
        stack: error.stack,
        url: window.location.href,
      });
    }
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-above-rose-50 via-above-peach-50 to-above-lavender-50">
      <Card className="max-w-2xl w-full shadow-xl border-above-rose-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3 text-above-rose-700">
            <div className="p-2 bg-above-rose-100 rounded-lg">
              <FileWarning className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Something went wrong!</CardTitle>
              <CardDescription>
                An unexpected error occurred while processing your request.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="font-mono text-sm">
                {error.message || 'An unknown error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs mt-2 opacity-70">
                  Error ID: {error.digest}
                </p>
              )}
            </AlertDescription>
          </Alert>

          {isDevelopment && error.stack && (
            <details className="space-y-2">
              <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Stack Trace (Development Only)
              </summary>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-auto max-h-64 font-mono">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="bg-above-blue-50 border border-above-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-above-blue-900 mb-2">What you can try:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-above-blue-800">
              <li>Refresh the page and try again</li>
              <li>Clear your browser cache and cookies</li>
              <li>Check your internet connection</li>
              <li>Try using a different browser</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => reset()}
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
              Go to Homepage
            </Button>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              If the problem persists, please{' '}
              <a href="/contact" className="text-primary underline">
                contact our support team
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}