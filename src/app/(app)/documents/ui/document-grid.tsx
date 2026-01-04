"use client";

import { Document } from "@/entities/document/model/schema";
import { DocumentCard } from "@/entities/document/ui/document-card";
import { useDocumentFilters } from "@/features/discovery/hooks/use-document-filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@shared/ui";
import { ChevronLeft, ChevronRight, FileX } from "lucide-react";

interface DocumentGridProps {
    documents: Document[];
    total: number;
    currentPage: number;
    currentSort: string;
}

export function DocumentGrid({ documents, total, currentPage, currentSort }: DocumentGridProps) {
    const { setSort, setPage, clearFilters } = useDocumentFilters();

    const totalPages = Math.ceil(total / 12);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                    Showing {documents.length > 0 ? (currentPage - 1) * 12 + 1 : 0} -{" "}
                    {Math.min(currentPage * 12, total)} of {total} documents
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <Select value={currentSort} onValueChange={setSort}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt,desc">Newest First</SelectItem>
                            <SelectItem value="createdAt,asc">Oldest First</SelectItem>
                            <SelectItem value="viewCount,desc">Most Viewed</SelectItem>
                            <SelectItem value="downloadCount,desc">Most Downloaded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <FileX className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No documents found</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        We couldn't find any documents matching your current filters. Try adjusting your search criteria.
                    </p>
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
