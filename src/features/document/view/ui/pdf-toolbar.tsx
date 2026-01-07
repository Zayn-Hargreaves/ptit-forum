'use client';

import { Button } from '@shared/ui/button/button';
import { Input } from '@shared/ui/input/input';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface PdfToolbarProps {
  scale: number;
  setScale: (scale: number) => void;
  pageNumber: number;
  numPages: number;
  setPageNumber: (page: number) => void;
}

export function PdfToolbar({
  scale,
  setScale,
  pageNumber,
  numPages,
  setPageNumber,
}: PdfToolbarProps) {
  return (
    <div className="bg-card sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b p-2 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          disabled={scale <= 0.5}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center text-sm font-medium">{Math.round(scale * 100)}%</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScale(Math.min(2.0, scale + 0.1))}
          disabled={scale >= 2.0}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Pagination Controls */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1 text-sm font-medium">
          <span>Page</span>
          <Input
            type="number"
            value={pageNumber}
            className="h-8 w-12 px-1 text-center"
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= numPages) {
                setPageNumber(val);
              }
            }}
            aria-label="Page Number"
          />
          <span className="text-muted-foreground">of {numPages}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
          disabled={pageNumber >= numPages}
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
