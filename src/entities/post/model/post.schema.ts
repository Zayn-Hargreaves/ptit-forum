import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề không được quá 200 ký tự')
    .trim(),

  content: z
    .string()
    .min(20, 'Nội dung bài viết quá ngắn (tối thiểu 20 ký tự)')
    .refine((val) => {
      const stripped = val.replaceAll(/<[^>]*>/g, '').trim();
      return stripped.length > 0;
    }, 'Nội dung không được để trống'),

  topicId: z.string().uuid('Chủ đề không hợp lệ'),

  fileMetadataIds: z.array(z.string().uuid()),
});

export const editPostSchema = createPostSchema.extend({
  topicId: z.string().optional(),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type EditPostFormValues = z.infer<typeof editPostSchema>;
