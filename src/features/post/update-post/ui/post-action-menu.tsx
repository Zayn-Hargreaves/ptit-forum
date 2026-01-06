'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@shared/ui/dropdown-menu/dropdown-menu';
import { Button } from '@shared/ui/button/button';
import { IPost } from '@entities/post/model/types';
import { EditPostDialog } from './edit-post-dialog';
import { useQuery } from '@tanstack/react-query';
import { sessionApi } from '@entities/session/api/session-api';

interface PostActionMenuProps {
  post: IPost;
  isDetailView?: boolean;
}

export function PostActionMenu({ post, isDetailView = false }: PostActionMenuProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Get current user to check if they're the author
  const { data: currentUser } = useQuery({
    queryKey: ['session', 'profile'],
    queryFn: sessionApi.getProfile
  });

  // Only show if user is the author
  const isAuthor = currentUser?.id === post.author.id;
  
  // Only show for PENDING or REJECTED posts (as per backend validation)
  const canEdit = post.postStatus === 'PENDING' || post.postStatus === 'REJECTED';

  if (!isAuthor || !canEdit) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-accent"
            onClick={(e) => e.stopPropagation()} // Prevent card click
          >
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          
          {/* Edit Button */}
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

          {/* Delete Button */}
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> 
            Xóa bài viết
          </DropdownMenuItem>
          
          {/* Show reason if rejected (optional feature) */}
          {post.postStatus === 'REJECTED' && (
             <>
               <DropdownMenuSeparator />
               <DropdownMenuItem 
                 className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-50"
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
      {isEditOpen && (
        <EditPostDialog 
          open={isEditOpen} 
          onOpenChange={setIsEditOpen} 
          post={post} 
        />
      )}
      
      {/* TODO: Delete Confirmation Dialog */}
      {isDeleteOpen && (
        <div>Delete confirmation dialog will be implemented</div>
      )}
    </>
  );
}
