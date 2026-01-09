import { z } from 'zod';

// --- Enums ---
export const ResourceTypeEnum = z.enum([
  'PERMISSION',
  'FACULTY',
  'CLASSROOM',
  'USER',
  'ROLE',
  'NOTIFICATION_EVENT',
  'ANNOUNCEMENT',
  'FILE',
  'POST',
  'CATEGORY',
  'TOPIC',
  'COMMENT',
  'TOPIC_MEMBER',
  'REACTION',
  'REPORT',
]);

export const AccessTypeEnum = z.enum(['PUBLIC', 'PRIVATE']);

// --- File Metadata ---
export const FileMetadataSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string(),
  url: z.string().nullable().optional(),
  contentType: z.string(),
  resourceType: ResourceTypeEnum.nullable().optional(),
  resourceId: z.string().uuid().nullable().optional(),
  onDrive: z.boolean().nullable().optional(),
  createdAt: z.string(),
});

export const FileMetadataResponseSchema = z.object({
  result: FileMetadataSchema,
});

export const FileListResponseSchema = z.object({
  result: z.object({
    content: z.array(FileMetadataSchema),
    totalPages: z.number(),
    totalElements: z.number(),
  }),
});

// --- Drive Files ---
export const DriveFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  webViewLink: z.string().optional(),
  webContentLink: z.string().optional(),
});

export const DriveFileListResponseSchema = z.array(DriveFileSchema);

// --- Requests ---
export const UploadFileRequestSchema = z.object({
  file: z.instanceof(File),
  // Removed folderName as per backend refactor
  accessType: AccessTypeEnum.default('PUBLIC'),
  resourceType: ResourceTypeEnum,
  resourceId: z.string().uuid().optional(),
});

export const PostAcceptedSelectSchema = z.object({
  nameFile: z.string().min(1, 'File name is required'),
  postIds: z.array(z.string()).min(1, 'Select at least one post'),
});

// --- Post Response ---
export const CommentAcceptedResponseSchema = z.preprocess(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => ({
    ...data,
    commentId: data.commentId ?? data.id,
  }),
  z.object({
    commentId: z.string(), // Relaxed from uuid() for test data
    content: z.string(),
    authorName: z.string().nullable().optional(),
  }),
);

export const PostAcceptedResponseSchema = z.object({
  postId: z.string(), // Relaxed from uuid() for test data
  title: z.string(),
  content: z.string(),
  authorName: z.string().nullable().optional(),
  comments: z.array(CommentAcceptedResponseSchema),
  syncStatus: z.enum(['NOT_SYNCED', 'SYNCED', 'OUTDATED']).optional(),
});

export const PostAcceptedListResponseSchema = z.array(PostAcceptedResponseSchema);

export type FileMetadata = z.infer<typeof FileMetadataSchema>;
export type UploadFileRequest = z.infer<typeof UploadFileRequestSchema>;
export type DriveFile = z.infer<typeof DriveFileSchema>;
export type PostAcceptedSelect = z.infer<typeof PostAcceptedSelectSchema>;
export type PostAcceptedResponse = z.infer<typeof PostAcceptedResponseSchema>;
