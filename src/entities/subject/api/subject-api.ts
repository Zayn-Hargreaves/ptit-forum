import { apiClient } from "@/shared/api/axios-client";
import { ApiResponse } from "@/shared/api/types";

export interface Subject {
    id: string;
    subjectName: string;
    subjectCode: string;
}

export const subjectApi = {
    getAll: async () => {
        const response = await apiClient.get<ApiResponse<Subject[]>>("/subjects");
        return response.data.result;
    },
};
