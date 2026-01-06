'use client';

import { FileX, RefreshCw } from 'lucide-react';

import { Document } from '@/entities/document/model/schema';
import { DocumentCard } from '@/entities/document/ui/document-card';
import { DocumentCardSkeleton } from '@/entities/document/ui/document-card-skeleton';
import { Button } from '@/shared/ui/button/button';

interface DocumentGridProps {
  documents?: Document[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const DocumentGrid = ({ documents, isLoading, isError, refetch }: DocumentGridProps) => {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
          <FileX className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">Failed to load documents</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          We encountered an error while fetching the document list. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <DocumentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-20 text-center">
        <p>No documents found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
};
