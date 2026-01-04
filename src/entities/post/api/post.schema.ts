import { z } from "zod";

// Define 1 item
export const BackendPostDTOSchema = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  title: z.string(),
  createdBy: z
    .object({
      id: z.number(),
      name: z.string(),
      avatarUrl: z.string().optional(),
    })
    .optional(),
  authorName: z.string().optional(),
  commentCount: z.number(),
  viewCount: z.number(),
  categoryName: z.string(),
  createdAt: z.string(),
});

export const BackendPostListSchema = z.union([
  z.array(BackendPostDTOSchema),
  z.object({ items: z.array(BackendPostDTOSchema) }),
  z.object({ content: z.array(BackendPostDTOSchema) }),
]);

export const BackendTrendingResponseSchema = z
  .object({
    result: z.array(BackendPostDTOSchema).optional().default([]),
    content: z.array(BackendPostDTOSchema).optional().default([]), 
  })
  .transform((data) => {
    return data.result.length > 0 ? data.result : data.content;
  });
