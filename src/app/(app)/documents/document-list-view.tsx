'use client';

import { useState } from 'react';

import { useDocuments } from '@/features/document/list/model/use-documents';
import { DocumentGrid } from '@/features/document/list/ui/document-grid';

export const DocumentListView = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12, // Grid 4 cols x 3 rows
    subjectId: undefined as string | undefined, // Type explicit just in case
  });

  const { data, isLoading, isError, refetch } = useDocuments(filters);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Browse thousands of study resources shared by students.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
          <aside className="hidden md:block">
            {/* Sidebar Filters */}
            <div className="bg-card text-card-foreground sticky top-24 rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Filters</h3>
              <div className="text-muted-foreground space-y-2 text-sm">
                <button
                  className={`cursor-pointer rounded p-2 ${
                    filters.subjectId === undefined
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setFilters((prev) => ({ ...prev, subjectId: undefined, page: 1 }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFilters((prev) => ({ ...prev, subjectId: undefined, page: 1 }));
                    }
                  }}
                >
                  All Subjects
                </button>
                {/* Mock Categories */}
                {['Mathematics', 'Computer Science', 'Economics', 'Psychology'].map((subject) => (
                  <div
                    key={subject}
                    className="hover:bg-muted cursor-pointer rounded p-2"
                    // In real app, we would use subject IDs. For mock, just console log or ignore for now as hook uses mock ID logic
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main>
            <DocumentGrid
              documents={data?.data}
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
            />
            {/* Simple Pagination Mock */}
            {!isLoading && !isError && data && data.total > filters.limit && (
              <div className="mt-8 flex justify-center">
                {/* Pagination UI could go here */}
                <p className="text-muted-foreground text-sm">
                  Showing {data.data.length} of {data.total} documents
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
