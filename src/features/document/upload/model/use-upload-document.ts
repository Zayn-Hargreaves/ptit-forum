import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/axios-client';
import { useRouter } from 'next/navigation';
import { generateThumbnailFromPdf } from '@/shared/utils/pdf-thumbnail';
import { toast } from 'sonner';

interface UploadDocumentVariables {
    title: string;
    description: string;
    subjectId: string;
    documentType: string;
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
            formData.append('documentType', data.documentType);
            formData.append('document', data.file);

            // Generate thumbnail
            try {
                const thumbnailBlob = await generateThumbnailFromPdf(data.file);
                if (thumbnailBlob) {
                    // Create a File from Blob to append to FormData properly with a name
                    const thumbnailFile = new File([thumbnailBlob], "thumbnail.jpg", { type: "image/jpeg" });
                    formData.append('image', thumbnailFile);
                } else {
                    console.warn("Failed to generate thumbnail, uploading without custom thumbnail");
                    // Backend requires 'image' param?
                    // CommonDocumentController checked: if (image.isEmpty()) throw BadRequest.
                    // UserDocumentController expects 'image' too.
                    // If generation fails, we should probably fail or send a placeholder?
                    // Or we should handle it. 
                    // Prompt says: "FE calls upload -> Attached both PDF and Image".
                    throw new Error("Không thể tạo ảnh thu nhỏ từ PDF. Vui lòng thử lại file khác.");
                }
            } catch (err) {
                console.error(err);
                throw new Error("Lỗi khi xử lý file PDF.");
            }

            const response = await apiClient.post('/users/me/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Tài liệu đã được tải lên!", {
                description: "Tài liệu của bạn đang chờ duyệt và sẽ hiển thị sớm.",
                duration: 5000,
            });
            router.push('/dashboard/documents');
        },
        onError: (error: any) => {
            toast.error("Tải lên thất bại", {
                description: error.message || "Đã có lỗi xảy ra."
            });
        }
    });
};
