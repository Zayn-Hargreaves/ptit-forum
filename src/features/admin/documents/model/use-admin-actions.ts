import { documentService } from '@shared/api/document.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useApproveDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentService.approveDocument,
    onSuccess: () => {
      toast.success('Document approved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to approve document');
    },
  });
};

export const useRejectDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      documentService.rejectDocument(id, reason),
    onSuccess: () => {
      toast.success('Document rejected');
      queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to reject document');
    },
  });
};
