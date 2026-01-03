'use client';

import { useDocumentDetail } from '@features/document/view/model/use-document-detail';
import { PdfViewer } from '@features/document/view/ui/pdf-viewer';
import { DocumentInfo } from '@features/document/view/ui/document-info';
import { Button } from '@shared/ui/button/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@shared/ui/skeleton/skeleton';

interface PageProps {
  params: {
    id: string;
  };
}

export default function DocumentDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { data: document, isLoading, isError } = useDocumentDetail(params.id);

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
        <div className="w-full">
          <PdfViewer
            url={process.env.NEXT_PUBLIC_USE_TEST_PDF === 'true' ? '/sample.pdf' : document.fileUrl}
            isPremium={document.isPremium}
          />
        </div>

        {/* Sidebar: Info */}
        <aside>
          <DocumentInfo document={document} />
        </aside>
      </div>
    </div>
  );
}
