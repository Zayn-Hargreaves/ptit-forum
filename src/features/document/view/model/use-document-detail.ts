import { useQuery } from '@tanstack/react-query';
import { getMockDocuments } from '@shared/api/mock/document.service';
import { Document } from '@entities/document/model/schema';

// Simulating a fetch by ID using the existing mock generator
// In a real app, this would be `getDocumentById(id)`
const fetchDocumentById = async (id: string): Promise<Document> => {
  // We fetch a list and pick the first one just to mock a return
  // In production we would hit /api/documents/:id
  const { data } = await getMockDocuments({ limit: 1 });
  if (data.length === 0) {
    throw new Error('Document not found');
  }
  // Override with requested ID for realism in route
  return { ...data[0], id, title: `Document ${id} (Mocked)`, pageCount: 5 };
};

export const useDocumentDetail = (id: string) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocumentById(id),
    staleTime: Infinity,
  });
};
