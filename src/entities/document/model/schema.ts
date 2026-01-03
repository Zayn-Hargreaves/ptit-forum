import { z } from 'zod';

export const DocumentStatusSchema = z.enum(['processing', 'published', 'failed']);

export const DocumentSubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export const DocumentAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().url(),
});

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5),
  description: z.string(),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  pageCount: z.number().int().positive(),
  viewCount: z.number().int().nonnegative(),
  downloadCount: z.number().int().nonnegative(),
  uploadDate: z.string().datetime(), // ISO string
  isPremium: z.boolean(),
  status: DocumentStatusSchema,
  previewImages: z.array(z.string().url()),
  author: DocumentAuthorSchema,
  subject: DocumentSubjectSchema,
});

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type DocumentSubject = z.infer<typeof DocumentSubjectSchema>;
export type DocumentAuthor = z.infer<typeof DocumentAuthorSchema>;
export type Document = z.infer<typeof DocumentSchema>;
