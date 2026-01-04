import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/axios-client';
import { useRouter } from 'next/navigation';

interface UploadDocumentVariables {
    title: string;
    description: string;
    subjectId: string;
    file: File;
}

export const useUploadDocument = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: UploadDocumentVariables) => {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('subjectId', data.subjectId);
            formData.append('document', data.file);

            // Backend expects 'document' part? Or just flat fields?
            // Standard Spring Boot multipart usually accepts params alongside 'file'.
            // If backend uses @RequestPart custom DTO, we might need JSON blob.
            // Assuming flat fields based on prompt instructions.

            const response = await apiClient.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    // Can expose progress via callback if passed to mutation, 
                    // but React Query mutation object doesn't have built-in progress state easily accessible globally 
                    // without custom wrapper. For now, we rely on browser upload speed (local dev is fast).
                    // If true progress bar is needed, we'd need to lift state up from the form.
                }
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate queries or just redirect
            router.push('/documents');
        },
    });
};
