import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@shared/api/mock/document.service";
import { DocumentListParams } from "./types";

export const useDocuments = (params: DocumentListParams) => {
    return useQuery({
        queryKey: ["documents", params],
        queryFn: () => getDocuments(params),
        staleTime: 5000,
    });
};
