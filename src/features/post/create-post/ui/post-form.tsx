'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Paperclip, X, Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@shared/ui/button/button';
import { Input } from '@shared/ui/input/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form/form';
import { GithubEditor } from '@shared/ui/editor/github-editor';
import { useFileUpload } from '@shared/hooks/use-file-upload';
import { postApi } from '@entities/post/api/post-api';
import { CreatePostFormValues, createPostSchema } from '@entities/post/model/post.schema';
import { ALLOWED_DOCUMENT_MIMES } from '@shared/constants/constants';
import type { ITopic } from '@entities/topic/model/types';
import type { IPost, PostAttachment } from '@entities/post/model/types';

import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover/popover';
import { cn } from '@shared/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/ui/command/command';
import { topicApi } from '@entities/topic/api/topic-api';

interface PostFormProps {
  onSuccess?: () => void;
  className?: string;
  popoverContainer?: HTMLElement | null;
  initialData?: IPost;
  mode?: 'create' | 'edit';
  defaultTopicId?: string;
}

interface TopicItemProps {
  topic: ITopic;
  selectedId?: string;
  onSelect: (id: string) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, selectedId, onSelect }) => (
  <CommandItem key={topic.id} value={topic.name} onSelect={() => onSelect(topic.id)}>
    <Check className={cn('mr-2 h-4 w-4', topic.id === selectedId ? 'opacity-100' : 'opacity-0')} />
    <span className="truncate">{topic.name}</span>
  </CommandItem>
);

export function PostForm({
  onSuccess,
  className,
  popoverContainer,
  initialData,
  mode = 'create',
  defaultTopicId,
}: Readonly<PostFormProps>) {
  const queryClient = useQueryClient();
  const [openTopic, setOpenTopic] = useState(false);

  const [existingFiles, setExistingFiles] = useState<PostAttachment[]>(initialData?.attachments || []);

  useEffect(() => {
    setExistingFiles(initialData?.attachments || []);
  }, [initialData?.attachments]);

  /* =======================
   * 1. FETCH TOPICS
   * ======================= */
  const {
    data: topics = [],
    isLoading: isLoadingTopics,
    isError: isTopicsError,
    error: topicsError,
    refetch: refetchTopics,
  } = useQuery<ITopic[]>({
    queryKey: ['topicsPostable'],
    queryFn: () => topicApi.getTopics(),
    enabled: mode === 'create', // Only fetch topics in create mode
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  React.useEffect(() => {
    if (isTopicsError && topicsError) {
      toast.error(topicsError.message || 'Không thể tải danh sách chủ đề');
    }
  }, [isTopicsError, topicsError]);

  /* =======================
   * 2. FORM SETUP
   * ======================= */
  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      topicId: initialData ? '' : (defaultTopicId || ''), // If editing, we don't strictly need topicId unless API requires it.
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
      topicId: initialData ? '' : (defaultTopicId || ''),
      fileMetadataIds: initialData?.attachments?.map((a) => a.id) || [],
    });
  }, [initialData, form, defaultTopicId]);

  const selectedTopicId = form.watch('topicId');
  const selectedTopicName = topics.find((t) => t.id === selectedTopicId)?.name || 'Chủ đề không tồn tại';

  const handleTopicSelect = (topicId: string) => {
    form.setValue('topicId', topicId, { shouldDirty: true, shouldValidate: true });
    setOpenTopic(false);
  };

  /* =======================
   * 3. FILE UPLOAD
   * ======================= */
  const {
    upload,
    isUploading: isUploadingAttachment,
    uploadedFiles,
    removeFile: removeNewFile,
    clearFiles: clearNewFiles,
  } = useFileUpload({
    validate: { maxSizeMB: 20, acceptedTypes: ALLOWED_DOCUMENT_MIMES },
    onSuccess: (file) => {
      const currentIds = form.getValues('fileMetadataIds') || [];
      form.setValue('fileMetadataIds', [...currentIds, file.id], { shouldDirty: true });
    },
  });

  const handleAttachmentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await upload(file, '/files/upload', 'POST', 'file', { folderName: 'posts/attachments' });
      e.target.value = '';
    }
  };

  const handleRemoveNewFile = (fileId: string) => {
    removeNewFile(fileId);
    const currentIds = form.getValues('fileMetadataIds') || [];
    form.setValue(
      'fileMetadataIds',
      currentIds.filter((id) => id !== fileId),
      { shouldDirty: true }
    );
  };

  const handleRemoveExistingFile = (fileId: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    const currentIds = form.getValues('fileMetadataIds') || [];
    form.setValue(
      'fileMetadataIds',
      currentIds.filter((id) => id !== fileId),
      { shouldDirty: true }
    );
  };

  /* =======================
   * 4. SUBMIT
   * ======================= */
  const { mutate: submitPost, isPending } = useMutation({
    mutationFn: (values: CreatePostFormValues) => {
      const payload = {
        title: values.title,
        content: values.content,
        images: values.fileMetadataIds
      };
      
      if (mode === 'edit' && initialData) {
        return postApi.updatePost(initialData.id, payload);
      }
      // For create, we need topicId
      return postApi.createPost(values.topicId, payload);
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
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(message);
    },
  });

  // Helper render item topic
  const groupedTopics = useMemo(() => {
    const groups: Record<string, ITopic[]> = {};
    topics.forEach((t) => {
      const category = (t as any).categoryName || 'Khác'; // ITopic might not have categoryName yet, verify types
      if (!groups[category]) groups[category] = [];
      groups[category].push(t);
    });
    return groups;
  }, [topics]);

  const isLoading = isPending || isUploadingAttachment;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => submitPost(values))} className={className}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
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

            {/* Topic Field - Only show in CREATE mode */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => {
                  let displayText;
                  if (isLoadingTopics) {
                    displayText = 'Đang tải...';
                  } else if (isTopicsError) {
                    displayText = 'Không thể tải chủ đề';
                  } else if (field.value) {
                    displayText = selectedTopicName;
                  } else {
                    displayText = 'Chọn chủ đề';
                  }
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Chủ đề <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover open={openTopic} onOpenChange={setOpenTopic}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openTopic}
                              disabled={isTopicsError}
                              className={cn(
                                'w-full h-10 justify-between font-normal',
                                !field.value && 'text-muted-foreground',
                                isTopicsError && 'border-destructive'
                              )}
                            >
                              <span className="truncate flex-1 text-left">{displayText}</span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start" container={popoverContainer}>
                          <Command>
                            <CommandInput placeholder="Tìm kiếm chủ đề..." />
                            <CommandList className="max-h-[300px] overflow-y-auto">
                              <CommandEmpty>Không tìm thấy chủ đề.</CommandEmpty>
                              {Object.entries(groupedTopics).map(([category, list]) => (
                                <CommandGroup key={category} heading={category}>
                                  {list.map((t) => (
                                    <TopicItem
                                      key={t.id}
                                      topic={t}
                                      selectedId={field.value}
                                      onSelect={handleTopicSelect}
                                    />
                                  ))}
                                </CommandGroup>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {isTopicsError && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => refetchTopics()}
                          className="mt-2 w-full"
                        >
                          Thử lại
                        </Button>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
          </div>

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <GithubEditor value={field.value || ''} onChange={field.onChange} />
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
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                ) : (
                  <Paperclip className="h-3 w-3 mr-2" />
                )}
                Thêm file
              </Button>
            </div>

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {/* Hiển thị File CŨ - using file.name now as per IPost */}
              {existingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 border rounded-md bg-muted/30 text-sm"
                >
                  <span className="truncate max-w-[200px] flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    {file.name} 
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:text-destructive"
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
                  className="flex items-center justify-between p-2 border rounded-md bg-muted/50 text-sm"
                >
                  <span className="truncate max-w-[200px]">{file.fileName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:text-destructive"
                    onClick={() => handleRemoveNewFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 mt-4 border-t">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'edit' ? 'Lưu thay đổi' : 'Đăng bài'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
