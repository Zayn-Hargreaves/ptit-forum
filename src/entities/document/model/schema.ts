import { z } from 'zod';
import { UserSchema } from '@entities/user/schema';
import { SubjectSchema } from '@entities/subject/model/schema';

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  pageCount: z.number().int().positive(),
  viewCount: z.number().int().nonnegative(),
  downloadCount: z.number().int().nonnegative(),
  uploadDate: z.coerce.date(), // Coerces ISO strings to Date objects
  author: UserSchema,
  subject: SubjectSchema,
  isPremium: z.boolean(),
  status: z.enum(['processing', 'published', 'failed']),
});

export type Document = z.infer<typeof DocumentSchema>;
