import { z } from 'zod';

import { AnnouncementType } from '@/entities/announcement/model/types';

export const draftAnnouncementSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  content: z.string().min(1, 'Nội dung không được để trống'),
  announcementType: z.nativeEnum(AnnouncementType),
  attachments: z.any().optional(),
  existingAttachments: z.any().optional(),
});

export const releaseAnnouncementSchema = z
  .object({
    targetFaculties: z.array(z.string()).default([]),
    targetCohorts: z.array(z.string()).default([]),
    specificClassCodes: z.string().optional(), // Input as string, processed later
  })
  .refine(
    (data) => {
      const hasFaculties = data.targetFaculties.length > 0;
      const hasCohorts = data.targetCohorts.length > 0;
      const hasClasses = data.specificClassCodes && data.specificClassCodes.trim().length > 0;
      // Allow if at least one target is specified, OR if it's meant to be global (handled by empty targets? - re-evaluating requirement)
      // Actually, backend might need at least one target if "Global" logic is removed or handled via ALL faculties.
      // For now, let's enforce at least one selection to be safe, or allow empty if backend supports "Global" via empty list (need to verify).
      // Based on previous code, there was an "isGlobal" switch. The new plan removed it.
      // Let's assume user must select AT LEAST ONE target scope.
      return hasFaculties || hasCohorts || hasClasses;
    },
    {
      message: 'Vui lòng chọn ít nhất một nhóm đối tượng (Khoa, Khóa, hoặc Lớp).',
      path: ['targetFaculties'], // Attach error to main field
    },
  );

export type DraftAnnouncementFormValues = z.infer<typeof draftAnnouncementSchema>;
export type ReleaseAnnouncementFormValues = z.infer<typeof releaseAnnouncementSchema>;
