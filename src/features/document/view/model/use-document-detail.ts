import { useQuery } from "@tanstack/react-query";
import { getDocumentById } from "@shared/api/mock/document.service";

export const useDocumentDetail = (id: string) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentById(id),
    staleTime: Infinity,
  });
};
