'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useMeasure } from 'react-use';
import { PdfToolbar } from './pdf-toolbar';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@shared/ui/button/button';

// Configure worker locally to avoid issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  isPremium?: boolean;
  onUnlock?: () => void;
}

export function PdfViewer({ url, isPremium = false, onUnlock }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  // Responsive measure
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Freemium Logic
  const shouldBlur = !isPremium && pageNumber > 3;

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden bg-background shadow-sm">
      <PdfToolbar
        scale={scale}
        setScale={setScale}
        pageNumber={pageNumber}
        numPages={numPages}
        setPageNumber={setPageNumber}
      />

      <div ref={ref} className="relative bg-muted/30 min-h-[500px] flex justify-center p-4 overflow-auto">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading PDF...</span>
            </div>
          }
          error={<div className="text-destructive font-medium">Failed to load PDF.</div>}
          className="shadow-lg"
        >
          <div className="relative">
            <Page
              pageNumber={pageNumber}
              width={width ? Math.min(width - 40, 800) : undefined} // Padding margin
              scale={scale}
              className={shouldBlur ? 'blur-md pointer-events-none select-none' : ''}
              renderTextLayer={!shouldBlur}
              renderAnnotationLayer={!shouldBlur}
            />

            {/* Premium Overlay */}
            {shouldBlur && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 z-10 backdrop-blur-[1px]">
                <div className="bg-background/95 p-6 rounded-lg shadow-xl text-center max-w-sm border backdrop-blur-sm">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Premium Content</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    This page is part of our Premium collection. Subscribe to unlock full access.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={onUnlock}>
                    Unlock Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Document>
      </div>
    </div>
  );
}
