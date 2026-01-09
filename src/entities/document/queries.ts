import { documentService } from '@shared/api/document.service';
import { useQuery } from '@tanstack/react-query';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  myDocuments: (params: Record<string, unknown>) =>
    [...documentKeys.lists(), 'my', params] as const,
};

export function useMyDocuments(
  params: { page?: number; limit?: number; sort?: string; status?: string; keyword?: string } = {},
) {
  return useQuery({
    queryKey: documentKeys.myDocuments(params),
    queryFn: () => documentService.getMyDocuments(params),
  });
}

export function usePublicDocuments(
  params: {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
    uploaderId?: string;
  } = {},
) {
  return useQuery({
    queryKey: [...documentKeys.lists(), params],
    queryFn: () => documentService.getDocuments(params),
    enabled: !!params.uploaderId,
  });
}
