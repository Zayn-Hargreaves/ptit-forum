import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@shared/api/axios-client";
import { ApiResponse } from "@shared/api/types";

export interface FileMetadata {
  id: string;
  url: string;
  fileName: string;
  type: string;
}

interface UseFileUploadOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  validate?: {
    maxSizeMB?: number;
    acceptedTypes?: string[];
  };
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
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
    endpoint: string = "/files/upload",
    method: "POST" | "PUT" = "POST",
    formDataKey: string = "file"
  ) => {
    if (options.validate?.maxSizeMB) {
      if (file.size / 1024 / 1024 > options.validate.maxSizeMB) {
        toast.error(`File quá lớn. Tối đa ${options.validate.maxSizeMB}MB`);
        return null;
      }
    }

    if (options.validate?.acceptedTypes) {
      if (!options.validate.acceptedTypes.includes(file.type)) {
        toast.error("Định dạng file không hỗ trợ");
        return null;
      }
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append(formDataKey, file);

    try {
      const response = await apiClient.request<ApiResponse<any>>({
        method,
        url: endpoint,
        data: formData,
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
    } catch (error: any) {
      console.error("Upload failed:", error);
      const msg = error.response?.data?.message || "Lỗi khi tải file";
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
