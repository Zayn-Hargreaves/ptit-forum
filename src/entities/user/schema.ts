import { z } from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(['USER', 'ADMIN']).catch('USER'),
});

export type User = z.infer<typeof UserSchema>;
