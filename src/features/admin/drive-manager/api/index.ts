import { apiClient as axiosInstance } from '@/shared/api/axios-client';

import {
  DriveFileListResponseSchema,
  FileListResponseSchema,
  FileMetadataResponseSchema,
  PostAcceptedListResponseSchema,
  PostAcceptedSelect,
  PostAcceptedSelectSchema,
  UploadFileRequest,
} from './../model/schema';

const BASE_URL = '/files';
const DRIVE_URL = '/drive';
const POST_URL = '/posts';

export const driveManagerApi = {
  // 1. Upload Internal File
  uploadFile: async (req: UploadFileRequest) => {
    const formData = new FormData();
    formData.append('file', req.file);
    // resourceType is required now
    formData.append('resourceType', req.resourceType);
    if (req.resourceId) formData.append('resourceId', req.resourceId);
    formData.append('accessType', req.accessType || 'PUBLIC');

    const { data } = await axiosInstance.post(`${BASE_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return FileMetadataResponseSchema.parse(data);
  },

  // 2. Get Internal Files (Search)
  getInternalFiles: async (params: {
    page: number;
    size: number;
    resourceType?: string;
    folder?: string;
    keyword?: string;
  }) => {
    const { data } = await axiosInstance.get(`${BASE_URL}`, { params });
    // Use safeParse to avoid crashing full app if one field is off
    const parsed = FileListResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error('API Response Validation Error:', parsed.error);
      throw new Error('Invalid API Response');
    }
    return parsed.data.result;
  },

  // 3. Upload to Drive (Sync)
  syncToDrive: async (fileId: string) => {
    const { data } = await axiosInstance.post(`${BASE_URL}/upload-to-drive`, {
      fileId,
    });
    return data; // Response might vary, keeping loose for now or define schema
  },

  // 4. Get Drive Files
  getDriveFiles: async () => {
    const { data } = await axiosInstance.get(`${DRIVE_URL}/list`);
    // Validation
    const parsed = DriveFileListResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Drive API Error:', parsed.error);
      return []; // Return empty on error to handle gracefully
    }
    return parsed.data;
  },

  // 5. Delete Drive File
  deleteDriveFile: async (fileId: string) => {
    await axiosInstance.delete(`${DRIVE_URL}/${fileId}`); // Fixed path
  },

  // 6. Get Accepted Posts (Source for Selection)
  getAcceptedPosts: async (
    syncStatus: 'NOT_SYNCED' | 'SYNCED' | 'OUTDATED' | 'ALL' = 'NOT_SYNCED',
  ) => {
    const params = syncStatus !== 'ALL' ? { syncStatus } : {};
    const { data } = await axiosInstance.get(`${POST_URL}/post-accepted`, { params });
    const parsed = PostAcceptedListResponseSchema.safeParse(data.result); // Backend wraps in 'result'
    if (!parsed.success) {
      console.error('Post API Error:', parsed.error);
      return [];
    }
    return parsed.data;
  },

  // 7. Post Export (Async)
  exportPosts: async (payload: PostAcceptedSelect) => {
    // Validate payload before sending
    const validPayload = PostAcceptedSelectSchema.parse(payload);

    const { data } = await axiosInstance.post(`${POST_URL}/post-accepted/upload`, validPayload);
    return data; // Returns 202 message string
  },
};
