"use client";

import { DocumentCard } from "@entities/document/ui/document-card";
import { DocumentCardSkeleton } from "@entities/document/ui/document-card-skeleton";
import { useDocuments } from "@features/document/list/model/use-documents";
import { DocumentListParams } from "@features/document/list/model/types";
import { Button } from "@shared/ui/button/button";
import { RefreshCw } from "lucide-react";

interface DocumentGridProps {
    params?: DocumentListParams;
}

export function DocumentGrid({ params = { page: 1, limit: 12 } }: DocumentGridProps) {
    const { data, isLoading, isError, refetch } = useDocuments(params);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <DocumentCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <p className="text-muted-foreground">Failed to load documents. Please try again.</p>
                <Button variant="outline" onClick={() => refetch()} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </Button>
            </div>
        );
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground">No documents found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
            ))}
        </div>
    );
}
