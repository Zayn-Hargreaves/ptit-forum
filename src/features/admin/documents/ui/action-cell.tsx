import { Document } from '@entities/document/model/schema';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/ui';
import { FileText, MoreHorizontal } from 'lucide-react';

import { useAdminDocumentStore } from '../model/admin-store';

interface ActionCellProps {
  document: Document;
}

export const ActionCell = ({ document }: ActionCellProps) => {
  const { openReview } = useAdminDocumentStore();

  // Handle case-insensitive status
  const _status = document.status.toUpperCase();
  // const isPending = _status === 'PENDING';

  return (
    <div className="flex items-center gap-2">
      {/* Primary Action: Review */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2"
        onClick={() => openReview(document)}
      >
        <FileText className="h-4 w-4" />
        Xem xét
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => openReview(document)}>
            <FileText className="mr-2 h-4 w-4" /> Xem chi tiết
          </DropdownMenuItem>

          {/* Quick actions could be kept here if needed, but for now redirecting to Review Sheet is safer for UX */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
