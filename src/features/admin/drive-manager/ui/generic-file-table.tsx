'use client';

import { format } from 'date-fns';
import { FileText, Loader2, UploadCloud } from 'lucide-react';

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

import { useInternalFiles } from '../model/use-internal-files';
import { SearchBar } from './search-bar';

export const InternalFileTable = () => {
  const { data, isLoading, page, setPage, syncToDrive, setKeyword } = useInternalFiles();

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
        <h3 className="text-lg font-medium">Internal Files</h3>
      </div>
      <SearchBar onSearch={setKeyword} placeholder="Search internal files..." />
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
                <TableCell className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-blue-500" />
                  {file.fileName}
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
                    <Button variant="outline" size="sm" onClick={() => syncToDrive(file.id)}>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Sync Drive
                    </Button>
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
                  No files found.
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
    </div>
  );
};
