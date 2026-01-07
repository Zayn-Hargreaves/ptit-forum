import { useQuery } from '@tanstack/react-query';
import { documentService } from '@shared/api/document.service';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  myDocuments: (params: any) => [...documentKeys.lists(), 'my', params] as const,
};

export function useMyDocuments(params: { page?: number; limit?: number; sort?: string; status?: string; keyword?: string } = {}) {
  return useQuery({
    queryKey: documentKeys.myDocuments(params),
    queryFn: () => documentService.getMyDocuments(params),
  });
}
