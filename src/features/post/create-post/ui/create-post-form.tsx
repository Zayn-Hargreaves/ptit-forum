"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Paperclip, X } from "lucide-react";

import { Button } from "@shared/ui/button/button";
import { Input } from "@shared/ui/input/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select/select";
import { GithubEditor } from "@shared/ui/editor/github-editor";
import { useFileUpload } from "@shared/hooks/use-file-upload";
import { postApi } from "@entities/post/api/post-api";
import {
  CreatePostFormValues,
  createPostSchema,
} from "@entities/post/model/post.schema";
import { ALLOWED_DOCUMENT_MIMES } from "@shared/constants/constants";
import { categoryApi } from "@entities/category/api/category-api";

interface CreatePostFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function CreatePostForm({
  onSuccess,
  className,
}: Readonly<CreatePostFormProps>) {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  React.useEffect(() => {
    if (isCategoriesError) {
      const msg =
        (categoriesError as any)?.response?.data?.message ||
        (categoriesError as any)?.message ||
        "Không thể tải danh sách chủ đề";
      toast.error("Lỗi tải chủ đề", { description: msg });
    }
  }, [isCategoriesError, categoriesError]);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      topicId: "",
      fileMetadataIds: [],
    },
  });

  const {
    upload,
    isUploading: isUploadingAttachment,
    uploadedFiles,
    removeFile,
    clearFiles,
  } = useFileUpload({
    validate: { maxSizeMB: 20, acceptedTypes: ALLOWED_DOCUMENT_MIMES },
    onSuccess: (file) => {
      const currentIds = form.getValues("fileMetadataIds") || [];
      form.setValue("fileMetadataIds", [...currentIds, file.id]);
    },
  });

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: postApi.create,
    onSuccess: () => {
      toast.success("Đăng bài thành công!");
      form.reset();
      clearFiles();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleAttachmentSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await upload(file, "/files/upload", "POST", "file", {
      folderName: "posts/attachments",
    });

    e.target.value = "";
  };

  const handleRemoveAttachment = (fileId: string) => {
    removeFile(fileId);
    const currentIds = form.getValues("fileMetadataIds") || [];
    form.setValue(
      "fileMetadataIds",
      currentIds.filter((id) => id !== fileId)
    );
  };

  const isLoading = isPending || isUploadingAttachment;

  return (
    <Form {...form}>
      <form
        id="create-post-form"
        onSubmit={form.handleSubmit((values) => createPost(values))}
        className={className}
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
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

            <FormField
              control={form.control}
              name="topicId"
              render={({ field }) => {
                let placeholderText = "Chọn chủ đề";
                if (isLoadingCategories) {
                  placeholderText = "Đang tải chủ đề...";
                } else if (isCategoriesError) {
                  placeholderText = "Lỗi tải chủ đề";
                }

                return (
                  <FormItem>
                    <FormLabel>
                      Chủ đề <span className="text-red-500">*</span>
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingCategories || isCategoriesError}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={placeholderText} />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <GithubEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Tài liệu đính kèm
              </FormLabel>

              <Input
                type="file"
                className="hidden"
                id="attachment-upload"
                onChange={handleAttachmentSelect}
                disabled={isLoading}
                accept={ALLOWED_DOCUMENT_MIMES.join(",")}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("attachment-upload")?.click()
                }
                disabled={isLoading}
              >
                {isUploadingAttachment ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                ) : (
                  <Paperclip className="h-3 w-3 mr-2" />
                )}
                Thêm file
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted/50 text-sm"
                  >
                    <span className="truncate max-w-[200px]">
                      {file.fileName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveAttachment(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 mt-4 border-t">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng bài
          </Button>
        </div>
      </form>
    </Form>
  );
}
