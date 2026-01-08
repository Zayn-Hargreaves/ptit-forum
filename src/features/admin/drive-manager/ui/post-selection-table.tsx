'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, FileUp } from 'lucide-react';
import { memo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/shared/ui/badge/badge';
import { Button } from '@/shared/ui/button/button';
import { Checkbox } from '@/shared/ui/checkbox/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table/table';

import { driveManagerApi } from '../api';
import { PostAcceptedResponse } from '../model/schema';
import { SelectionState, useSelectionStore } from '../model/use-selection-store';
import { PostPreviewSheet } from './post-preview-sheet';

// --- Hooks ---
const useAcceptedPosts = (syncStatus: 'NOT_SYNCED' | 'SYNCED' | 'OUTDATED' | 'ALL') => {
  return useQuery({
    queryKey: ['accepted-posts', syncStatus],
    queryFn: () => driveManagerApi.getAcceptedPosts(syncStatus),
  });
};

// --- Components ---

const PostRow = memo(
  ({
    post,
    store,
    onPreview,
  }: {
    post: PostAcceptedResponse;
    store: SelectionState;
    onPreview: (post: PostAcceptedResponse) => void;
  }) => {
    const commentIds = post.comments.map((c) => c.commentId);

    // Calculate Indeterminate / Checked state
    const selectedCount = commentIds.filter((id) => store.hasId(id)).length;
    // If post has no comments, check if post itself is selected
    const isPostChecked = store.hasId(post.postId);

    // Indeterminate if: Some comments selected BUT NOT ALL (and not 0).
    const isIndeterminate = selectedCount > 0 && selectedCount < commentIds.length;

    const handleToggle = (checked: boolean) => {
      store.togglePost(post.postId, commentIds, checked);
    };

    // Truncate content for preview
    const truncateContent = (html: string) => {
      // Simple strip tags for preview text
      const text = html.replace(/<[^>]*>?/gm, '');
      return text.length > 100 ? text.substring(0, 100) + '...' : text;
    };

    const getSyncStatusBadge = (status?: 'NOT_SYNCED' | 'SYNCED' | 'OUTDATED') => {
      if (!status) return null;

      const variants: Record<
        string,
        { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
      > = {
        NOT_SYNCED: { variant: 'default', label: 'Not Synced' },
        SYNCED: { variant: 'secondary', label: 'Synced' },
        OUTDATED: { variant: 'destructive', label: 'Outdated' },
      };

      const config = variants[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
      <TableRow className="group hover:bg-muted/20">
        <TableCell className="w-[50px]">
          <Checkbox
            checked={isIndeterminate ? 'indeterminate' : isPostChecked}
            onCheckedChange={(val) => handleToggle(val === true)}
          />
        </TableCell>
        <TableCell className="max-w-[200px] truncate font-medium" title={post.title}>
          {post.title}
        </TableCell>
        <TableCell className="text-muted-foreground max-w-[300px] truncate text-sm">
          {truncateContent(post.content)}
        </TableCell>
        <TableCell>{post.authorName || 'Unknown'}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span>{post.comments.length} comments</span>
            {getSyncStatusBadge(post.syncStatus)}
          </div>
        </TableCell>
        <TableCell>
          <Button variant="ghost" size="icon" onClick={() => onPreview(post)} title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  },
);
PostRow.displayName = 'PostRow';

export const PostSelectionTable = () => {
  const [syncStatusFilter, setSyncStatusFilter] = useState<
    'NOT_SYNCED' | 'SYNCED' | 'OUTDATED' | 'ALL'
  >('NOT_SYNCED');
  const { data: posts, isLoading } = useAcceptedPosts(syncStatusFilter);
  const store = useSelectionStore();
  const queryClient = useQueryClient();

  // Sheet State
  const [previewPost, setPreviewPost] = useState<PostAcceptedResponse | null>(null);

  const exportMutation = useMutation({
    mutationFn: driveManagerApi.exportPosts,
    onSuccess: () => {
      // Capture selected IDs before resetting store (snapshot for optimistic update)
      const selectedPostIds =
        posts?.filter((p) => store.hasId(p.postId)).map((p) => p.postId) || [];

      // Optimistic Update: Remove exported posts from cache immediately (Inbox Zero pattern)
      queryClient.setQueryData(
        ['accepted-posts', syncStatusFilter],
        (oldData: PostAcceptedResponse[] | undefined) => {
          if (!oldData) return oldData;

          // Filter out exported posts - they'll be synced in background
          return oldData.filter((post) => !selectedPostIds.includes(post.postId));
        },
      );

      // Reset selection & show toast
      store.reset();
      toast.success('Đã đẩy vào hàng đợi xử lý ngầm.');
    },
    onError: () => toast.error('Failed to send export request'),
  });

  const handleExport = () => {
    const selectedPostIds = posts?.filter((p) => store.hasId(p.postId)).map((p) => p.postId) || [];

    if (selectedPostIds.length === 0) {
      toast.error('Please select at least one post');
      return;
    }

    exportMutation.mutate({
      nameFile: `Export_${new Date().toISOString()}`,
      postIds: selectedPostIds,
    });
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (!posts || posts.length === 0)
    return <div className="p-4 text-center">No posts available for export.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter:</label>
          <Select
            value={syncStatusFilter}
            onValueChange={(value: 'NOT_SYNCED' | 'SYNCED' | 'OUTDATED' | 'ALL') =>
              setSyncStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOT_SYNCED">Not Synced</SelectItem>
              <SelectItem value="SYNCED">Synced</SelectItem>
              <SelectItem value="OUTDATED">Outdated</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-muted flex items-center justify-between rounded-md p-2">
        <div className="text-sm font-medium">
          Selected: {store.getSelectedIds().length} items (Posts + Comments)
        </div>
        <Button onClick={handleExport} disabled={exportMutation.isPending}>
          {exportMutation.isPending ? (
            'Processing...'
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" /> Export to Drive
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <PostRow key={post.postId} post={post} store={store} onPreview={setPreviewPost} />
            ))}
          </TableBody>
        </Table>
      </div>

      <PostPreviewSheet
        post={previewPost}
        isOpen={!!previewPost}
        onClose={() => setPreviewPost(null)}
      />
    </div>
  );
};
