import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface FileMetadata {
  id: string;
  url: string;
  fileName: string;
  type: string;
}

interface UseFileUploadOptions<T = FileMetadata | FileMetadata[]> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  validate?: {
    maxSizeMB?: number;
    acceptedTypes?: string[];
  };
}

export function useFileUpload<T = FileMetadata | FileMetadata[]>(
  options: UseFileUploadOptions<T> = {},
) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([]);

  const isMountedRef = useRef(true);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const upload = async (
    file: File,
    endpoint: string = '/files/upload',
    method: 'POST' | 'PUT' = 'POST',
    formDataKey: string = 'file',
    additionalData?: Record<string, string>,
  ) => {
    if (options.validate?.maxSizeMB) {
      if (file.size / 1024 / 1024 > options.validate.maxSizeMB) {
        toast.error(`File quá lớn. Tối đa ${options.validate.maxSizeMB}MB`);
        return null;
      }
    }

    if (options.validate?.acceptedTypes) {
      if (!options.validate.acceptedTypes.includes(file.type)) {
        toast.error('Định dạng file không hỗ trợ');
        return null;
      }
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append(formDataKey, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    try {
      const response = await apiClient.request<ApiResponse<T>>({
        method,
        url: endpoint,
        data: formData,
        headers: {
          'Content-Type': null,
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size;
          const current = progressEvent.loaded;
          const percent = Math.round((current / total) * 100);
          setProgress(percent);
        },
      });

      const result = response.data.result;

      const newFiles = Array.isArray(result) ? result : [result];
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      options.onSuccess?.(result);
      return result;
    } catch (error: unknown) {
      console.error('Upload failed:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || 'Lỗi khi tải file';
      toast.error(msg);
      options.onError?.(error);
      return null;
    } finally {
      setIsUploading(false);
      timeoutIdRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setProgress(0);
        }
      }, 1000);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return {
    upload,
    isUploading,
    progress,
    uploadedFiles,
    removeFile,
    clearFiles,
  };
}
