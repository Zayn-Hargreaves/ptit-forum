import { z } from 'zod';

export const createSubjectSchema = z.object({
  subjectName: z.string().min(1, 'Tên môn học không được để trống'),
  subjectCode: z.string().min(1, 'Mã môn học không được để trống').toUpperCase(),
  // SỬA LẠI ĐOẠN NÀY:
  credit: z.coerce
    .number() // Không truyền object vào đây
    .int('Tín chỉ phải là số nguyên')
    .min(1, 'Tín chỉ tối thiểu là 1'),
  description: z.string().optional(),
});

export type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;
