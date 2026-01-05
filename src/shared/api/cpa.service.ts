import { apiClient } from './axios-client';
import type { ApiResponse } from './types';

export interface GradeSubjectAverageProfileResponse {
    id: string;
    letterCurrentScore: string | null;
    letterImprovementScore: string | null;
    currentScore: number | null;
    improvementScore: number | null;
    subjectName: string;
    subjectCode: string;
    subjectId: string;
    credit: number;
}

export interface GpaProfileResponse {
    id: string;
    gpaProfileCode: string;
    letterGpaScore: string | null;
    numberGpaScore: number | null;
    previousNumberGpaScore: number | null;
    passedCredits: number;
    gradeSubjectAverageProfileResponses: GradeSubjectAverageProfileResponse[];
}

export interface CpaProfileResponse {
    id: string;
    cpaProfileName: string;
    cpaProfileCode: string;
    letterCpaScore: string | null;
    numberCpaScore: number | null;
    previousNumberCpaScore: number | null;
    accumulatedCredits: number;
    gpaProfiles: GpaProfileResponse[];
}

export interface GpaProfileRequest {
    id: string;
    gpaProfileCode: string;
    letterGpaScore: string | null;
    numberGpaScore: number | null;
    previousNumberGpaScore: number | null;
    passedCredits: number;
    gradeSubjectAverageProfileRequests: {
        id: string;
        letterCurrentScore: string | null;
        letterImprovementScore: string | null;
    }[];
}

export interface CpaProfileRequest {
    id: string;
    gpaProfileRequests: GpaProfileRequest[];
}

export const cpaService = {
    initializeCpaProfile: async (): Promise<CpaProfileResponse> => {
        const response = await apiClient.post<ApiResponse<CpaProfileResponse>>(
            '/api/cpa-profiles'
        );
        return response.data.result;
    },

    updateCpaScore: async (
        cpaProfileId: string,
        data: CpaProfileRequest
    ): Promise<CpaProfileResponse> => {
        const response = await apiClient.put<ApiResponse<CpaProfileResponse>>(
            `/api/cpa-profiles/update-cpa-score/${cpaProfileId}`,
            data
        );
        return response.data.result;
    },

    getCpaProfile: async (id: string): Promise<CpaProfileResponse> => {
        const response = await apiClient.get<ApiResponse<CpaProfileResponse>>(
            `/api/cpa-profiles/${id}`
        );
        return response.data.result;
    },
};
