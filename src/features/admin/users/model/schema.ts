import { z } from 'zod';

export const userSearchSchema = z.object({
  email: z.string().optional(),
  fullName: z.string().optional(),
  studentCode: z.string().optional(),
  classCode: z.string().optional(),
  enable: z.enum(['true', 'false', 'all']).optional(), // String for select input, need conversion
});

export type UserSearchFormValues = z.infer<typeof userSearchSchema>;
