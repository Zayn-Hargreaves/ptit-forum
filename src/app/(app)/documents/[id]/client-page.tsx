'use client';

import { useDocumentDetail } from '@features/document/view/model/use-document-detail';
import { PdfViewer } from '@features/document/view/ui/pdf-viewer';
import { DocumentInfo } from '@features/document/view/ui/document-info';
import { Button } from '@shared/ui/button/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { DocumentErrorFallback } from '@features/document/view/ui/document-error-fallback';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useRef, useState } from 'react';

export default function DocumentDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: document, isLoading, isError } = useDocumentDetail(id);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }

    updateWidth(); // Initial calculation

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <Skeleton className="h-[600px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-xl font-bold">Document not found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground pl-0"
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-4 h-4" /> Back to Documents
      </Button>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
        {/* Main Content: PDF Viewer */}
        <div className="w-full" ref={containerRef}>
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <DocumentErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
                documentUrl={document.fileUrl}
              />
            )}
          >
            {containerWidth > 0 && <PdfViewer url={document.fileUrl} isPremium={document.isPremium} width={containerWidth} />}
          </ErrorBoundary>
        </div>

        {/* Sidebar: Info */}
        <aside>
          <DocumentInfo document={document} />
        </aside>
      </div>
    </div>
  );
}
