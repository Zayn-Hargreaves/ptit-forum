import { z } from 'zod';

export const createAnnouncementSchema = z
  .object({
    title: z.string().min(1, 'Tiêu đề không được để trống'),
    content: z.string().min(1, 'Nội dung không được để trống'),
    announcementType: z.enum(['GENERAL', 'CLASS_MEETING', 'PAY_FEE', 'ACADEMIC'], {
        required_error: 'Vui lòng chọn loại thông báo',
    }),
    isGlobal: z.boolean().default(false),
    targetFaculties: z.array(z.string()).default([]),
    targetCohorts: z.array(z.string()).default([]),
    specificClassCodes: z.array(z.string()).default([]),
    attachments: z.any().optional(), // Handled separately or mapped to fileMetadataIds
  })
  .refine(
    (data) => {
      if (data.isGlobal) return true;
      // If not global, at least one target must be selected
      const hasFaculties = data.targetFaculties.length > 0;
      const hasCohorts = data.targetCohorts.length > 0;
      const hasClasses = data.specificClassCodes.length > 0;
      return hasFaculties || hasCohorts || hasClasses;
    },
    {
      message: 'Nếu không phải thông báo chung, vui lòng chọn ít nhất một nhóm đối tượng (Khoa, Khóa, hoặc Lớp).',
      path: ['isGlobal'], // Error attached to isGlobal checkbox
    }
  );

export type CreateAnnouncementFormValues = z.infer<typeof createAnnouncementSchema>;
