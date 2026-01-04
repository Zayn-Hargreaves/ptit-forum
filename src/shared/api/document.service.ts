import { apiClient, getPublicImageUrl } from './axios-client';
import type { Document } from '@/entities/document/model/schema';
import type { ApiResponse, PageResponse } from './types';

export interface GetDocumentsParams {
    page?: number;
    limit?: number;
    subjectId?: string;
    sort?: string; // e.g. 'viewCount,desc'
    status?: string;
    keyword?: string;
    type?: string;
    q?: string; // Alias for keyword/title
}

export const getDocuments = async (params: GetDocumentsParams = {}): Promise<{ data: Document[]; total: number }> => {
    const { page = 1, limit = 10, subjectId, sort, type, q, keyword } = params;

    const pageIndex = page > 0 ? page - 1 : 0;

    const response = await apiClient.get<ApiResponse<PageResponse<Document>>>('/documents/search', {
        params: {
            page: pageIndex,
            size: limit,
            subjectId: subjectId || undefined,
            sort: sort || 'createdAt,desc',
            title: q || keyword || undefined,
            documentType: type || undefined,
            documentStatus: 'PUBLISHED',
        },
    });

    const pageData = response.data.result;

    const documents = pageData.content.map(doc => ({
        ...doc,
        thumbnailUrl: getPublicImageUrl(doc.thumbnailUrl),
        fileUrl: getPublicImageUrl(doc.fileUrl),
        author: {
            ...doc.author,
            avatar: getPublicImageUrl(doc.author?.avatar),
        },
        previewImages: doc.previewImages?.map((url: string) => getPublicImageUrl(url)) || [],
    }));

    return {
        data: documents,
        total: pageData.totalElements,
    };
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
    try {
        const response = await apiClient.get<ApiResponse<Document>>(`/documents/${id}`);
        const doc = response.data.result;

        if (!doc) return null;

        return {
            ...doc,
            thumbnailUrl: getPublicImageUrl(doc.thumbnailUrl),
            fileUrl: getPublicImageUrl(doc.fileUrl),
            author: {
                ...doc.author,
                avatar: getPublicImageUrl(doc.author?.avatar),
            },
            previewImages: doc.previewImages?.map((url: string) => getPublicImageUrl(url)) || [],
        };
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const adminSearchDocuments = async (params: GetDocumentsParams = {}): Promise<{ data: Document[]; total: number }> => {
    const { page = 1, limit = 10, subjectId, sort, status, keyword } = params;
    const pageIndex = page > 0 ? page - 1 : 0;

    const response = await apiClient.get<ApiResponse<PageResponse<Document>>>('/admin/documents/search', {
        params: {
            page: pageIndex,
            size: limit,
            subjectId,
            sort,
            title: keyword,
            documentStatus: status,
        },
    });

    const pageData = response.data.result;

    const documents = pageData.content.map((doc: any) => ({
        ...doc,
        status: doc.documentStatus || doc.status,
        thumbnailUrl: getPublicImageUrl(doc.thumbnailUrl),
        fileUrl: getPublicImageUrl(doc.fileUrl),
        author: {
            ...doc.author,
            avatar: getPublicImageUrl(doc.author?.avatar),
        },
        previewImages: doc.previewImages?.map((url: string) => getPublicImageUrl(url)) || [],
    }));

    return {
        data: documents,
        total: pageData.totalElements,
    };
};

export const approveDocument = async (id: string): Promise<void> => {
    await apiClient.put(`/admin/documents/${id}/approve`);
};

export const rejectDocument = async (id: string, reason: string): Promise<void> => {
    await apiClient.put(`/admin/documents/${id}/reject`, { reason });
};

// User Dashboard APIs
export const getMyDocuments = async (params: GetDocumentsParams = {}): Promise<{ data: Document[]; total: number }> => {
    try {
        const { page = 1, limit = 10, sort, status, keyword } = params;
        const pageIndex = page > 0 ? page - 1 : 0;

        const response = await apiClient.get<ApiResponse<PageResponse<Document>>>('/users/me/documents', {
            params: {
                page: pageIndex,
                size: limit,
                sort,
                title: keyword,
                documentStatus: status,
            }
        });

        const pageData = response.data.result;
        return {
            data: pageData.content.map((doc: any) => ({
                ...doc,
                status: doc.documentStatus || doc.status,
                thumbnailUrl: getPublicImageUrl(doc.thumbnailUrl),
                fileUrl: getPublicImageUrl(doc.fileUrl),
                author: { ...doc.author, avatar: getPublicImageUrl(doc.author?.avatar) },
                previewImages: doc.previewImages?.map((url: string) => getPublicImageUrl(url)) || [],
            })),
            total: pageData.totalElements,
        };
    } catch (e) {
        throw e;
    }
};

export const updateDocumentMetadata = async (id: string, data: { title: string; description: string; subjectId: string }): Promise<Document> => {
    const response = await apiClient.put<ApiResponse<Document>>(`/documents/${id}`, data);
    return response.data.result;
};

export const deleteDocument = async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
};

export const documentService = {
    getDocuments,
    getDocumentById,
    adminSearchDocuments,
    approveDocument,
    rejectDocument,
    getMyDocuments,
    updateDocumentMetadata,
    deleteDocument,
};
