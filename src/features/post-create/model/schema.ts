import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_OFFICE_TYPES } from "@/shared/constants/file-types";

const ALL_ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_OFFICE_TYPES];

export const createPostSchema = z.object({
  title: z.string()
    .min(5, "Tiêu đề quá ngắn (tối thiểu 5 ký tự)")
    .max(100, "Tiêu đề quá dài (tối đa 100 ký tự)"),
  
  content: z.string()
    .min(20, "Nội dung bài viết cần chi tiết hơn (tối thiểu 20 ký tự)"),

  // Validate danh sách file đính kèm (Attachments)
  attachments: z.array(z.custom<File>())
    .refine((files) => files.length <= 5, "Chỉ được đính kèm tối đa 5 file.")
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Mỗi file đính kèm không được quá ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    )
    .refine(
      (files) => files.every((file) => ALL_ACCEPTED_TYPES.includes(file.type)),
      "Chỉ chấp nhận file văn phòng (PDF, Word, Excel, PowerPoint, Text) hoặc ảnh."
    )
    .optional(), // Không bắt buộc
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
