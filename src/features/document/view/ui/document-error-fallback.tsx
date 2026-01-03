'use client';

import { Button } from '@shared/ui/button/button';
import { AlertCircle, Download, RefreshCw } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';

interface DocumentErrorFallbackProps extends FallbackProps {
  documentUrl?: string;
}

export function DocumentErrorFallback({ error, resetErrorBoundary, documentUrl }: DocumentErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-destructive/5 text-center min-h-[400px]">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        We couldn't load the document viewer. This might be due to a network issue or a corrupted file.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button onClick={resetErrorBoundary} variant="default" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        {documentUrl && (
          <Button variant="outline" className="gap-2" onClick={() => window.open(documentUrl, '_blank')}>
            <Download className="w-4 h-4" />
            Download Original
          </Button>
        )}
      </div>

      <div className="mt-8 pt-4 border-t w-full max-w-md">
        <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded wrap-break-word">
          Error: {error.message}
        </p>
      </div>
    </div>
  );
}
