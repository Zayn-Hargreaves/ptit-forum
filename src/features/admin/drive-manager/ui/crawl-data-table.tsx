'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, FileText, Loader2, UploadCloud } from 'lucide-react';

import { Badge } from '@/shared/ui/badge/badge';
import { Button } from '@/shared/ui/button/button';
import { Pagination } from '@/shared/ui/pagination/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table/table';

import { FileMetadata } from '../model/schema';
import { useInternalFiles } from '../model/use-internal-files';
import { FilePreviewSheet } from './file-preview-sheet';
import { SearchBar } from './search-bar';

export const CrawlDataTable = () => {
  const { data, isLoading, page, setPage, syncToDrive, setKeyword } = useInternalFiles({
    resourceType: 'ANNOUNCEMENT',
    folder: 'announcements/',
  });
  const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const files = data?.content || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Crawl Data</h3>
      </div>
      <SearchBar onSearch={setKeyword} placeholder="Search crawled files..." />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Drive Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium" title={file.fileName}>
                    <FileText className="h-4 w-4 shrink-0 text-orange-500" />
                    <span className="max-w-[400px] truncate">{file.fileName}</span>
                  </div>
                </TableCell>
                <TableCell>{file.resourceType || 'N/A'}</TableCell>
                <TableCell>{format(new Date(file.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell>
                  {file.onDrive ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      Synced
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Local</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {!file.onDrive && (
                    <div className="flex items-center gap-2">
                      {file.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Preview"
                          onClick={() => setPreviewFile(file)}
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => syncToDrive(file.id)}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Sync Drive
                      </Button>
                    </div>
                  )}
                  {file.onDrive && (
                    <Button variant="ghost" size="sm" disabled>
                      Synced
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {files.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                  No crawl data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end pt-4">
        <Pagination
          currentPage={page + 1}
          totalPages={data?.totalPages || 1}
          onPageChange={(p) => setPage(p - 1)}
        />
      </div>
      <FilePreviewSheet
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};
