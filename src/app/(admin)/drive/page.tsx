import { Metadata } from 'next';

import { DriveManagerWidget } from '@/features/admin/drive-manager';

export const metadata: Metadata = {
  title: 'Drive Manager | Admin Dashboard',
  description: 'Manage Google Drive synchronization and file exports.',
};

export default function DrivePage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Drive Manager</h1>
        <p className="text-muted-foreground text-lg">
          Central hub for file synchronization, post exports, and Drive resource management.
        </p>
      </div>

      <DriveManagerWidget />
    </div>
  );
}
