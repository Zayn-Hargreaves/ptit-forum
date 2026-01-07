'use client';

import { useQuery } from '@tanstack/react-query';
import { FileUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { DocumentGrid } from '@/features/document/list/ui/document-grid';
import { documentService } from '@/shared/api/document.service';
import { Button } from '@/shared/ui/button/button';

export const UserDocumentsList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-documents', page],
    queryFn: () => documentService.getMyDocuments({ page, limit: 12 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="mb-4 text-red-500">You must be logged in to view your documents.</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/50 py-20 text-center">
        <div className="bg-primary/10 mb-4 rounded-full p-4">
          <FileUp className="text-primary h-10 w-10" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">No uploads yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Share your knowledge with the community. Upload your first document now!
        </p>
        {/* Trigger upload modal or navigate to upload page - assuming handled by parent or separate button */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Uploads</h2>
      </div>

      <DocumentGrid
        documents={data.data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />

      {/* Pagination */}
      {data.total > 12 && (
        <div className="flex justify-center pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center px-4">Page {page}</div>
            <Button
              variant="outline"
              disabled={data.data.length < 12} // Simple check, ideally check against total
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
