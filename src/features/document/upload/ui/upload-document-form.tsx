'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { getErrorMessage } from '@shared/lib/utils';
import { Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DocumentType } from '@/entities/document/model/schema';
import { SubjectResponse, subjectService } from '@/shared/api/subject.service';

import { useUploadDocument } from '../model/use-upload-document';

const uploadSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  subjectId: z.string().min(1, 'Vui lòng chọn môn học'),
  documentType: z.nativeEnum(DocumentType, { message: 'Vui lòng chọn loại tài liệu' }),
  // File validation is manual since RHF integration with file input is tricky
});

type FormData = z.infer<typeof uploadSchema>;

export const UploadDocumentForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  const uploadMutation = useUploadDocument();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(uploadSchema),
  });

  useEffect(() => {
    // Fetch subjects on mount
    const fetchSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const res = await subjectService.search({ limit: 100 });
        // Handle response mapping based on what subjectService returns (PageResponse)
        setSubjects(res.content);
      } catch (error) {
        console.error('Failed to load subjects', error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        alert('Chỉ chấp nhận tệp PDF');
        e.target.value = ''; // Reset input
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('Kích thước tệp phải nhỏ hơn 50MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!file) {
      alert('Vui lòng chọn tệp');
      return;
    }
    uploadMutation.mutate({ ...data, file });
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Tải lên tài liệu</h2>

      {uploadMutation.isError && (
        <div className="mb-4 rounded bg-red-50 p-4 text-red-600">
          Tải lên thất bại. Vui lòng thử lại. {getErrorMessage(uploadMutation.error)}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input
            {...register('title')}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="VD: Đề thi giữa kỳ Giải tích nâng cao 2024"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Mô tả nội dung của tài liệu..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Môn học</label>
          <select
            {...register('subjectId')}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoadingSubjects}
          >
            <option value="">Chọn môn học...</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subjectName} ({sub.subjectCode})
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <p className="mt-1 text-sm text-red-500">{errors.subjectId.message}</p>
          )}
        </div>

        {/* Document Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Loại tài liệu</label>
          <select
            {...register('documentType')}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Chọn loại tài liệu...</option>
            <option value={DocumentType.COURSE_BOOK}>Giáo trình</option>
            <option value={DocumentType.SLIDE}>Slide bài giảng</option>
            <option value={DocumentType.EXAM}>Đề thi</option>
          </select>
          {errors.documentType && (
            <p className="mt-1 text-sm text-red-500">{errors.documentType.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:bg-gray-50">
          <UploadCloud className="mx-auto mb-2 h-12 w-12 text-gray-400" />
          <div className="flex justify-center text-sm text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
              <span>Tải lên tệp</span>
              <input type="file" className="sr-only" onChange={onFileChange} accept=".pdf" />
            </label>
            <p className="pl-1">hoặc kéo thả</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">PDF tối đa 50MB</p>

          {file && (
            <div className="mt-4 flex items-center justify-center rounded bg-blue-50 p-2 text-sm text-blue-700">
              Đã chọn: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/documents" className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Hủy
          </Link>
          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploadMutation.isPending ? 'Đang tải lên...' : 'Tải lên tài liệu'}
          </button>
        </div>
      </form>
    </div>
  );
};
