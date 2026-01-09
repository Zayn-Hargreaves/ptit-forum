'use client';

import { postApi } from '@entities/post/api/post-api';
import {
  CreatePostFormValues,
  createPostSchema,
  EditPostFormValues,
  editPostSchema,
} from '@entities/post/model/post.schema';
import type { IPost, PostAttachment } from '@entities/post/model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ALLOWED_DOCUMENT_MIMES } from '@shared/constants/constants';
import { FileMetadata, useFileUpload } from '@shared/hooks/use-file-upload';
import { Button } from '@shared/ui/button/button';
import { GithubEditor } from '@shared/ui/editor/github-editor';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/form/form';
import { Input } from '@shared/ui/input/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, Paperclip, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PostFormProps {
  onSuccess?: () => void;
  className?: string;
  initialData?: IPost;
  mode?: 'create' | 'edit';
  defaultTopicId?: string;
}

export function PostForm({
  onSuccess,
  className,
  initialData,
  mode = 'create',
  defaultTopicId,
}: Readonly<PostFormProps>) {
  const queryClient = useQueryClient();

  const [existingFiles, setExistingFiles] = useState<PostAttachment[]>(
    initialData?.attachments || [],
  );

  useEffect(() => {
    setExistingFiles(initialData?.attachments || []);
  }, [initialData?.attachments]);

  /* =======================
   * 2. FORM SETUP
   * ======================= */
  const schema = mode === 'edit' ? editPostSchema : createPostSchema;

  const form = useForm<CreatePostFormValues | EditPostFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      topicId: initialData?.topic?.id || defaultTopicId || '',
      fileMetadataIds: initialData?.attachments?.map((a) => a.id) || [],
    },
    mode: 'onSubmit',
  });

  // Note: createPostSchema might require topicId. If editing, we might need to fake it or handle it.
  // Assuming update doesn't change topic.

  useEffect(() => {
    form.reset({
      title: initialData?.title || '',
      content: initialData?.content || '',
      topicId: initialData?.topic?.id || defaultTopicId || '',
      fileMetadataIds: initialData?.attachments?.map((a) => a.id) || [],
    });
  }, [initialData, form, defaultTopicId]);

  /* =======================
   * 3. FILE UPLOAD
   * ======================= */
  const {
    upload,
    isUploading: isUploadingAttachment,
    uploadedFiles,
    removeFile: removeNewFile,
    clearFiles: clearNewFiles,
  } = useFileUpload<FileMetadata>({
    validate: { maxSizeMB: 20, acceptedTypes: ALLOWED_DOCUMENT_MIMES },
    onSuccess: (file) => {
      const currentIds = form.getValues('fileMetadataIds') || [];
      form.setValue('fileMetadataIds', [...currentIds, file.id], { shouldDirty: true });
    },
  });

  const handleAttachmentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await upload(file, '/files/upload', 'POST', 'file', {
          resourceType: 'POST',
        });
      }
      e.target.value = '';
    }
  };

  const handleRemoveNewFile = (fileId: string) => {
    removeNewFile(fileId);
    const currentIds = form.getValues('fileMetadataIds') || [];
    form.setValue(
      'fileMetadataIds',
      currentIds.filter((id) => id !== fileId),
      { shouldDirty: true },
    );
  };

  const handleRemoveExistingFile = (fileId: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    const currentIds = form.getValues('fileMetadataIds') || [];
    form.setValue(
      'fileMetadataIds',
      currentIds.filter((id) => id !== fileId),
      { shouldDirty: true },
    );
  };

  /* =======================
   * 4. SUBMIT
   * ======================= */
  const { mutate: submitPost, isPending } = useMutation({
    mutationFn: (values: CreatePostFormValues | EditPostFormValues) => {
      const payload = {
        title: values.title,
        content: values.content,
        images: values.fileMetadataIds,
      };

      if (mode === 'edit' && initialData) {
        return postApi.updatePost(initialData.id, payload);
      }
      // For create, we need topicId
      return postApi.createPost(values.topicId!, payload);
    },
    onSuccess: () => {
      toast.success(mode === 'edit' ? 'Cập nhật thành công!' : 'Đăng bài thành công!');

      if (mode === 'create') {
        form.reset({
          title: '',
          content: '',
          topicId: '',
          fileMetadataIds: [],
        });
        clearNewFiles();
      }

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: ['post', initialData.id] });
      }

      onSuccess?.();
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra';
      toast.error(message);
    },
  });

  const isLoading = isPending || isUploadingAttachment;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => submitPost(values))} className={className}>
        <div className="space-y-4">
          <div className="grid gap-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiêu đề <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề bài viết..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <GithubEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    editorContentClassName="min-h-[600px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" /> Tài liệu đính kèm
              </FormLabel>
              <Input
                type="file"
                multiple
                className="hidden"
                id="attachment-upload"
                onChange={handleAttachmentSelect}
                disabled={isLoading}
                accept={ALLOWED_DOCUMENT_MIMES.join(',')}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => document.getElementById('attachment-upload')?.click()}
              >
                {isUploadingAttachment ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Paperclip className="mr-2 h-3 w-3" />
                )}
                Thêm file
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* Hiển thị File CŨ - using file.name now as per IPost */}
              {existingFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-muted/30 flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <span className="flex max-w-[200px] items-center gap-2 truncate">
                    <Check className="h-3 w-3 text-green-500" />
                    {file.fileName ?? file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:text-destructive h-6 w-6"
                    onClick={() => handleRemoveExistingFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {/* Hiển thị File MỚI - Upload hook returns object with fileName */}
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-muted/50 flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <span className="max-w-[200px] truncate">{file.fileName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:text-destructive h-6 w-6"
                    onClick={() => handleRemoveNewFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-background sticky bottom-0 z-20 mt-4 flex justify-end gap-2 border-t pt-4 pb-4">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'edit' ? 'Lưu thay đổi' : 'Đăng bài'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
