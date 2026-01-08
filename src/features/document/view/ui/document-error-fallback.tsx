'use client';

import { AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';

import { Button } from '@/shared/ui/button/button';

interface DocumentErrorFallbackProps extends FallbackProps {
  documentUrl?: string;
}

export const DocumentErrorFallback = ({
  error,
  resetErrorBoundary,
  documentUrl,
}: DocumentErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-900/50 dark:bg-red-900/10">
      <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/20">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">
        Unable to load document preview
      </h3>
      <p className="mb-6 max-w-sm text-center text-sm text-red-700 dark:text-red-300">
        {error.message || 'Something went wrong while displaying this document.'}
      </p>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          variant="outline"
          onClick={resetErrorBoundary}
          className="gap-2 border-red-200 hover:bg-red-100 hover:text-red-900 dark:border-red-800 dark:hover:bg-red-900/30"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>

        {documentUrl ? (
          <Button
            asChild
            className="gap-2 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <a href={documentUrl} download>
              <Download className="h-4 w-4" />
              Download Original
            </a>
          </Button>
        ) : (
          <Button
            disabled
            className="gap-2 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <Download className="h-4 w-4" />
            Download Original
          </Button>
        )}
      </div>
    </div>
  );
};
