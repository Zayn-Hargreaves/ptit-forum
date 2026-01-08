'use client';

import { ExternalLink, FileText, FolderOpen, MoreVertical, Trash2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button/button';
import { Card, CardContent, CardFooter } from '@/shared/ui/card/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/dropdown-menu';

import { DriveFile } from '../model/schema';
import { useDriveFiles } from '../model/use-drive-files';

const EmptyState = () => (
  <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
    <FolderOpen className="text-muted-foreground mb-4 h-12 w-12" />
    <h3 className="text-lg font-medium">No files on Drive</h3>
    <p className="text-muted-foreground text-sm">Synced files will appear here.</p>
  </div>
);

const DriveFileCard = ({ file, onDelete }: { file: DriveFile; onDelete: (id: string) => void }) => {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.open(file.webViewLink, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" /> Open in Drive
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(file.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="bg-muted/30 flex h-32 flex-col items-center justify-center p-6">
        <FileText className="mb-2 h-12 w-12 text-blue-500" />
      </CardContent>

      <CardFooter className="border-t bg-white p-3">
        <span className="w-full truncate text-sm font-medium" title={file.name}>
          {file.name}
        </span>
      </CardFooter>
    </Card>
  );
};

export const DriveFileGrid = () => {
  const { data: files, isLoading, deleteFile } = useDriveFiles();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!files || files.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-5">
      {files.map((file) => (
        <DriveFileCard key={file.id} file={file} onDelete={deleteFile} />
      ))}
    </div>
  );
};
