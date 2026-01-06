import { useQuery } from '@tanstack/react-query';

import { documentService, GetDocumentsParams } from '@/shared/api/document.service';

export const useDocuments = (params: GetDocumentsParams = {}) => {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentService.getDocuments(params),
    placeholderData: (previousData) => previousData, // Optional: keep previous data while fetching new (better UX for pagination)
  });
};
