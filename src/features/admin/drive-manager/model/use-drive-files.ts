import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { driveManagerApi } from '../api';
import { DriveFile } from '../model/schema';

export const DRIVE_FILES_KEY = ['drive-files'];

export const useDriveFiles = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Files
  const query = useQuery({
    queryKey: DRIVE_FILES_KEY,
    queryFn: driveManagerApi.getDriveFiles,
  });

  // 2. Optimistic Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: driveManagerApi.deleteDriveFile,

    // Triggered before API call
    onMutate: async (fileId) => {
      // Cancel ongoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: DRIVE_FILES_KEY });

      // Snapshot previous value
      const previousFiles = queryClient.getQueryData<DriveFile[]>(DRIVE_FILES_KEY);

      // Optimistic Update: Remove item from cache immediately
      queryClient.setQueryData<DriveFile[]>(DRIVE_FILES_KEY, (old) => {
        return old ? old.filter((f) => f.id !== fileId) : [];
      });

      // Return context for rollback
      return { previousFiles };
    },

    // If API fails
    onError: (err, fileId, context) => {
      // Rollback to previous state
      if (context?.previousFiles) {
        queryClient.setQueryData(DRIVE_FILES_KEY, context.previousFiles);
      }
      toast.error('Failed to delete file. It has been restored.');
    },

    // Always refetch to sync logic
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DRIVE_FILES_KEY });
    },

    // Optional success toast (UX decision: Silent success is faster, but toast confirms action)
    onSuccess: () => {
      toast.success('File deleted from Drive');
    },
  });

  return {
    ...query,
    deleteFile: deleteMutation.mutate,
  };
};
