'use client';

import { useQuery } from '@tanstack/react-query';
import { documentService } from '@/shared/api/mock/document.service';
import { PdfViewer } from '@/features/document/view/ui/pdf-viewer';
import { PdfWrapper } from '@/features/document/view/ui/pdf-wrapper';
import { Button } from '@/shared/ui/button/button';
import { ErrorBoundary } from '@/shared/ui/error-boundary/error-boundary';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Document } from '@/entities/document/model/schema';

interface DocumentDetailViewProps {
  id: string;
  initialData: Document;
}

export const DocumentDetailView = ({ id, initialData }: DocumentDetailViewProps) => {
  const {
    data: document,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocumentById(id),
    initialData: initialData, // Hydrate with server data
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-[600px] w-full bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
        <Link href="/documents">
          <Button>Back to Documents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header / Back */}
        <div className="mb-6">
          <Link
            href="/documents"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{document.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={document.author.avatar} alt={document.author.name} className="w-6 h-6 rounded-full" />
              <span>{document.author.name}</span>
            </div>
            <span>•</span>
            <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{document.pageCount} pages</span>
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className="w-full">
          {/* 
               In a real app, document.fileUrl would be the PDF source. 
               For this phase, we use the local sample.pdf as requested 
               BUT pass isPremium from the mock doc to test logic.
            */}
          <PdfWrapper className="w-full flex justify-center">
            {(width) => (
              <ErrorBoundary fallback={<div className="text-center py-10">Failed to load PDF</div>}>
                <PdfViewer url="/sample.pdf" width={width} isPremium={document.isPremium} />
              </ErrorBoundary>
            )}
          </PdfWrapper>
        </div>
      </div>
    </div>
  );
};
