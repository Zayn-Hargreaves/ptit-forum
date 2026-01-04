import { apiClient, getPublicImageUrl } from './axios-client';
import type { Document } from '@/entities/document/model/schema';
import type { ApiResponse, PageResponse } from './types';

// Define DTO to match Backend Response exactly
interface DocumentDto {
    id: string;
    title: string;
    description: string;
    documentType: any;
    documentStatus: any;
    urlDoc: string; // Backend sends urlDoc
    thumbnailUrl: string;
    previewImages: string[];
    pageCount: number;
    isPremium: boolean;
    fileSize: number;
    viewCount: number;
    downloadCount: number;
    originalFilename: string;
    rejectionReason?: string;
    createdAt: string; // Backend sends createdAt
    uploadedBy: any;
    subject: any;
}

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

const mapDtoToDocument = (dto: DocumentDto): Document => {
    return {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        fileUrl: getPublicImageUrl(dto.urlDoc), // Map urlDoc -> fileUrl
        thumbnailUrl: getPublicImageUrl(dto.thumbnailUrl),
        pageCount: dto.pageCount || 0,
        viewCount: dto.viewCount || 0,
        downloadCount: dto.downloadCount || 0,
        uploadDate: dto.createdAt, // Map createdAt -> uploadDate
        isPremium: dto.isPremium || false,
        status: String(dto.documentStatus || 'PENDING').toUpperCase() as any,
        previewImages: dto.previewImages?.map((url: string) => getPublicImageUrl(url)) || [],
        author: {
            id: dto.uploadedBy?.id || 'unknown',
            name: dto.uploadedBy?.fullName || 'Unknown',
            avatar: getPublicImageUrl(dto.uploadedBy?.avatarUrl) || '',
        },
        subject: {
            id: dto.subject?.id || 'unknown',
            name: dto.subject?.subjectName || 'Unknown',
            code: dto.subject?.subjectCode || 'UNK',
        },
    };
};

export const getDocuments = async (params: GetDocumentsParams = {}): Promise<{ data: Document[]; total: number }> => {
    const { page = 1, limit = 10, subjectId, sort, type, q, keyword } = params;

    const pageIndex = page > 0 ? page - 1 : 0;

    // Use DocumentDto for response type
    const response = await apiClient.get<ApiResponse<PageResponse<DocumentDto>>>('/documents/search', {
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

    const documents = pageData.content.map(mapDtoToDocument);

    return {
        data: documents,
        total: pageData.totalElements,
    };
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
    try {
        const response = await apiClient.get<ApiResponse<DocumentDto>>(`/documents/${id}`);
        const doc = response.data.result;

        if (!doc) return null;

        return mapDtoToDocument(doc);
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

    const response = await apiClient.get<ApiResponse<PageResponse<DocumentDto>>>('/admin/documents/search', {
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

    const documents = pageData.content.map(mapDtoToDocument);

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

        const response = await apiClient.get<ApiResponse<PageResponse<DocumentDto>>>('/users/me/documents', {
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
            data: pageData.content.map(mapDtoToDocument),
            total: pageData.totalElements,
        };
    } catch (e) {
        throw e;
    }
};

export const updateDocumentMetadata = async (id: string, data: { title: string; description: string; subjectId: string }): Promise<Document> => {
    const response = await apiClient.put<ApiResponse<DocumentDto>>(`/documents/${id}`, data);
    return mapDtoToDocument(response.data.result);
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
