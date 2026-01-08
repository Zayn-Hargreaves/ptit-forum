import { CohortCode } from '@shared/api/classroom.service';
import { z } from 'zod';

export const createSubjectReferenceSchema = z.object({
  subjectId: z.string().min(1, 'Vui lòng chọn môn học'),
  facultyId: z.string().min(1, 'Vui lòng chọn khoa'),
  semesterId: z.coerce.number().int('Học kỳ phải là số nguyên').min(1, 'Học kỳ không hợp lệ'),
  cohortCode: z.nativeEnum(CohortCode, {
    errorMap: () => ({ message: 'Vui lòng chọn khóa học' }),
  }),
});

export type CreateSubjectReferenceFormValues = z.infer<typeof createSubjectReferenceSchema>;
