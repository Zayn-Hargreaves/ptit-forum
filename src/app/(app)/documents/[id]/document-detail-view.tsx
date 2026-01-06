'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Document } from '@/entities/document/model/schema';
import { PdfViewer } from '@/features/document/view/ui/pdf-viewer';
import { PdfWrapper } from '@/features/document/view/ui/pdf-wrapper';
import { documentService } from '@/shared/api/mock/document.service';
import { Button } from '@/shared/ui/button/button';
import { ErrorBoundary } from '@/shared/ui/error-boundary/error-boundary';

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
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-8">
          <div className="bg-muted h-8 w-1/3 rounded"></div>
          <div className="bg-muted h-[600px] w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Document Not Found</h1>
        <Link href="/documents">
          <Button>Back to Documents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header / Back */}
        <div className="mb-6">
          <Link
            href="/documents"
            className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{document.title}</h1>
          <div className="text-muted-foreground flex items-center space-x-4 text-sm">
            <div className="flex items-center gap-2">
              <Image
                src={document.author.avatar}
                alt={document.author.name}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
              <span>{document.author.name}</span>
            </div>
            <span>•</span>
            <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{document.pageCount} pages</span>
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className="relative w-full">
          {document.status === 'PENDING' && (
            <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm">
              <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
                <h3 className="mb-2 text-xl font-bold text-yellow-600">Đang chờ duyệt</h3>
                <p className="mb-4 text-gray-600">
                  Tài liệu này đang được BQT kiểm duyệt. Chỉ có bạn (tác giả) và Admin mới có thể
                  xem nội dung lúc này.
                </p>
                {/* We assume the user seeing this IS the author or admin because API would throw 404 otherwise */}
              </div>
            </div>
          )}
          {/* 
               In a real app, document.fileUrl would be the PDF source. 
               For this phase, we use the local sample.pdf as requested 
               BUT pass isPremium from the mock doc to test logic.
            */}
          <PdfWrapper className="flex w-full justify-center">
            {(width) => (
              <ErrorBoundary fallback={<div className="py-10 text-center">Failed to load PDF</div>}>
                <PdfViewer url={document.fileUrl} width={width} isPremium={document.isPremium} />
              </ErrorBoundary>
            )}
          </PdfWrapper>
        </div>
      </div>
    </div>
  );
};
