import { useQuery } from "@tanstack/react-query";
import { getMockDocuments } from "@shared/api/mock/document.service";
import { DocumentListParams } from "./types";

export const useDocuments = (params: DocumentListParams) => {
    return useQuery({
        queryKey: ["documents", params],
        queryFn: () => getMockDocuments(params),
        staleTime: 5000,
    });
};
