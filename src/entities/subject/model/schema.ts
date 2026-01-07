import { z } from 'zod';

export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export type Subject = z.infer<typeof SubjectSchema>;
