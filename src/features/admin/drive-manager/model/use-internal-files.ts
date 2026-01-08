import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { driveManagerApi } from '../api';

const INTERNAL_FILES_KEY = ['internal-files'];

export const useInternalFiles = (props?: { resourceType?: string; folder?: string }) => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [resourceType, setResourceType] = useState<string | undefined>(props?.resourceType);
  const queryClient = useQueryClient();

  // 🧠 Smart Polling Logic
  const query = useQuery({
    queryKey: [...INTERNAL_FILES_KEY, page, resourceType, props?.folder, keyword],
    queryFn: () =>
      driveManagerApi.getInternalFiles({
        page,
        size: 10,
        resourceType: resourceType,
        folder: props?.folder,
        keyword: keyword || undefined,
      }),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      return false; // Polling logic preserved (temporarily disabled as per previous code)
    },
  });

  const uploadMutation = useMutation({
    mutationFn: driveManagerApi.uploadFile,
    onSuccess: () => {
      toast.success('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: INTERNAL_FILES_KEY });
    },
    onError: () => toast.error('Failed to upload file'),
  });

  const syncMutation = useMutation({
    mutationFn: driveManagerApi.syncToDrive,
    onSuccess: () => {
      toast.success('Sync request sent. Processing in background...');
      queryClient.invalidateQueries({ queryKey: INTERNAL_FILES_KEY });
    },
    onError: () => toast.error('Failed to sync file'),
  });

  return {
    ...query,
    page,
    setPage,
    setResourceType,
    keyword,
    setKeyword,
    uploadFile: uploadMutation.mutate,
    syncToDrive: syncMutation.mutate,
    isUploading: uploadMutation.isPending,
  };
};
