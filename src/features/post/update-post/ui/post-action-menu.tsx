import { TargetType } from '@entities/interaction/model/types';
import { IPost } from '@entities/post/model/types';
import { sessionApi } from '@entities/session/api/session-api';
import { ReportDialog } from '@features/report/ui/report-dialog';
import { Button } from '@shared/ui/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Flag, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { EditPostDialog } from './edit-post-dialog';

interface PostActionMenuProps {
  post: IPost;
  isDetailView?: boolean;
}

export function PostActionMenu({ post, isDetailView: _isDetailView = false }: PostActionMenuProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Get current user to check if they're the author
  const { data: currentUser } = useQuery({
    queryKey: ['session', 'profile'],
    queryFn: sessionApi.getProfile,
  });

  // Only show if user is the author
  const isAuthor = currentUser?.id === post.author.id;

  // Only show for PENDING or REJECTED posts (as per backend validation)
  const canEdit = post.postStatus === 'PENDING' || post.postStatus === 'REJECTED';

  const showMenu = (isAuthor && canEdit) || !isAuthor;

  if (!showMenu) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-accent h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()} // Prevent card click
          >
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Edit/Delete for Author */}
          {isAuthor && canEdit && (
            <>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa bài viết
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa bài viết
              </DropdownMenuItem>
            </>
          )}

          {/* Report for Non-Author */}
          {!isAuthor && (
            <DropdownMenuItem
              className="text-orange-600 focus:bg-orange-50 focus:text-orange-600"
              onClick={(e) => {
                e.stopPropagation();
                setIsReportOpen(true);
              }}
            >
              <Flag className="mr-2 h-4 w-4" />
              Báo cáo vi phạm
            </DropdownMenuItem>
          )}

          {/* Show reason if rejected (optional feature) */}
          {post.postStatus === 'REJECTED' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-yellow-600 focus:bg-yellow-50 focus:text-yellow-600"
                disabled
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Bài viết bị từ chối
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      {isEditOpen && <EditPostDialog open={isEditOpen} onOpenChange={setIsEditOpen} post={post} />}

      {/* Report Dialog */}
      <ReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        targetId={post.id}
        targetType={TargetType.POST}
      />

      {/* TODO: Delete Confirmation Dialog */}
      {isDeleteOpen && <div>Delete confirmation dialog will be implemented</div>}
    </>
  );
}
