import { z } from 'zod';

export const gradeSubjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    credit: z.number().min(0),
    .string()
        .regex(/^([A-F][+-]?|)$/, { message: 'Điểm không hợp lệ' })
        .optional(),
    isExcluded: z.boolean().optional(),
});

export const gpaFormSchema = z.object({
    subjects: z.array(gradeSubjectSchema),
});

export type GpaFormValues = z.infer<typeof gpaFormSchema>;
