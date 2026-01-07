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
    gpaProfileCode: string; // Used for context, server might ignore or verify
    letterGpaScore: string | null;
    numberGpaScore: number | null;
    previousNumberGpaScore: number | null;
    passedCredits: number;
    gradeSubjectAverageProfileRequests: {
        id: string | null | undefined; // Can be null if new subject
        subjectId?: string; // Needed for new subjects
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
            '/cpa-profiles'
        );
        return response.data.result;
    },

    updateCpaScore: async (
        cpaProfileId: string,
        data: CpaProfileRequest
    ): Promise<CpaProfileResponse> => {
        const response = await apiClient.put<ApiResponse<CpaProfileResponse>>(
            `/cpa-profiles/update-cpa-score/${cpaProfileId}`,
            data
        );
        return response.data.result;
    },

    getCpaProfile: async (id: string): Promise<CpaProfileResponse> => {
        const response = await apiClient.get<ApiResponse<CpaProfileResponse>>(
            `/cpa-profiles/${id}`
        );
        return response.data.result;
    },

    addGpaProfileForCpaProfile: async (cpaProfileId: string): Promise<CpaProfileResponse> => {
        const response = await apiClient.put<ApiResponse<CpaProfileResponse>>(
            `/cpa-profiles/add-gpa-profile/${cpaProfileId}`, 
            {} // Empty body if none needed, or check controller
        );
        return response.data.result;
    },
    
    // Check deleteGpaProfileInCpaProfile logic if needed, 
    // but assuming CpaPage doesn't utilize it yet or handles it differently.
};
