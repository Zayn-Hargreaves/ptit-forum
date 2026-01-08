'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Database, FileText, Globe, HardDrive } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs/tabs';

import { DRIVE_FILES_KEY } from '../model/use-drive-files';
import { CrawlDataTable } from './crawl-data-table';
import { DirectUploadModal } from './direct-upload-modal';
import { DriveFileGrid } from './drive-file-grid';
import { InternalFileTable } from './generic-file-table';
import { PostSelectionTable } from './post-selection-table';

export const DriveManagerWidget = () => {
  const queryClient = useQueryClient();

  return (
    <Tabs defaultValue="internal" className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-[800px] grid-cols-4">
          <TabsTrigger value="internal" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Internal Files
          </TabsTrigger>
          <TabsTrigger value="crawl" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Data Crawl
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Forum Posts
          </TabsTrigger>
          <TabsTrigger value="drive" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" /> Google Drive
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="bg-background rounded-lg border p-6 shadow-sm">
        <TabsContent value="internal" className="mt-0 space-y-4">
          <div className="mb-4 flex flex-col space-y-1">
            <h3 className="text-lg font-medium">Internal Storage</h3>
            <p className="text-muted-foreground text-sm">
              Manage files uploaded to the server and sync them to Google Drive.
            </p>
          </div>
          <InternalFileTable />
        </TabsContent>

        <TabsContent value="crawl" className="mt-0 space-y-4">
          <div className="mb-4 flex flex-col space-y-1">
            <h3 className="text-lg font-medium">Data Crawl</h3>
            <p className="text-muted-foreground text-sm">
              Manage crawled data (Portal, Announcements). Sync to Drive to archive.
            </p>
          </div>
          <CrawlDataTable />
        </TabsContent>

        <TabsContent value="posts" className="mt-0 space-y-4">
          <div className="mb-4 flex flex-col space-y-1">
            <h3 className="text-lg font-medium">Export Posts</h3>
            <p className="text-muted-foreground text-sm">
              Select accepted posts and comments to generate documents on Drive.
            </p>
          </div>
          <PostSelectionTable />
        </TabsContent>

        <TabsContent value="drive" className="mt-0 space-y-4">
          <div className="mb-4 flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-medium">Drive Management</h3>
              <p className="text-muted-foreground text-sm">
                View and manage files currently synced to Google Drive.
              </p>
            </div>
            <DirectUploadModal
              onUploadSuccess={() => {
                queryClient.invalidateQueries({ queryKey: DRIVE_FILES_KEY });
              }}
            />
          </div>
          <DriveFileGrid />
        </TabsContent>
      </div>
    </Tabs>
  );
};
