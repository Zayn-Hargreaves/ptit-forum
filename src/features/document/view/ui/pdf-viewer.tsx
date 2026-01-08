'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { ChevronLeft, ChevronRight, Lock, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Document, Page } from 'react-pdf';

import { Button } from '@/shared/ui/button/button';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

import { setupPdfWorker } from '../model/pdf-worker';
import { DocumentErrorFallback } from './document-error-fallback';

// Ensure worker is set up
setupPdfWorker();

const MAX_VIEWER_WIDTH = 800;

interface PdfViewerProps {
  url: string;
  isPremium?: boolean;
  width: number;
}

const PdfViewerContent = ({ url, isPremium = false, width }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => Math.min(Math.max(1, prevPageNumber + offset), numPages));
  };

  const changeScale = (delta: number) => {
    setScale((prevScale) => Math.max(0.5, Math.min(2.0, prevScale + delta)));
  };



  return (
    <div className="flex w-full flex-col items-center space-y-4">
      {/* Toolbar */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex w-full max-w-2xl items-center justify-between rounded-lg border p-2 shadow-sm backdrop-blur">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber >= numPages}
            onClick={() => changePage(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => changeScale(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => changeScale(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="relative flex min-h-[500px] w-full max-w-4xl justify-center overflow-hidden rounded-md border bg-slate-50 dark:bg-slate-900">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-20">
              <Skeleton className="h-[600px] w-full max-w-2xl" />
            </div>
          }
          error={
            // We let ErrorBoundary handle this usually, or we can use this internal error prop for load failures.
            // But the task asked to wrap the viewer in Error Boundary.
            // If Document fails to load, it might throw or trigger this error prop.
            // Let's re-throw so ErrorBoundary catches it or use fallback here.
            // actually react-pdf's error prop renders in place.
            // Let's keep a simple message here but the ErrorBoundary around the whole component catches crashes.
            <div className="flex flex-col items-center justify-center p-20 text-red-500">
              <p>Failed to load PDF.</p>
            </div>
          }
          className="flex justify-center"
        >
          <div className="relative">
            <Page
              pageNumber={pageNumber}
              width={width * 0.95 > MAX_VIEWER_WIDTH ? MAX_VIEWER_WIDTH : width * 0.95} // Cap max width or use responsive width
              scale={scale}
              className="shadow-lg transition-all duration-200"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </div>
        </Document>
      </div>
    </div>
  );
};

export const PdfViewer = (props: PdfViewerProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={DocumentErrorFallback}
      onReset={() => window.location.reload()}
    >
      <PdfViewerContent {...props} />
    </ErrorBoundary>
  );
};
