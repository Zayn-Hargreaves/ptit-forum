'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadDocument } from '../model/use-upload-document';
import { subjectService, SubjectResponse } from '@/shared/api/subject.service';
import { DocumentType } from '@/entities/document/model/schema';
import { Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';

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
                setSubjects(res.result.content);
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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tải lên tài liệu</h2>

            {uploadMutation.isError && (
                <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                    Tải lên thất bại. Vui lòng thử lại. {(uploadMutation.error as any)?.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <input
                        {...register('title')}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="VD: Đề thi giữa kỳ Giải tích nâng cao 2024"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Mô tả nội dung của tài liệu..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                    <select
                        {...register('subjectId')}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        disabled={isLoadingSubjects}
                    >
                        <option value="">Chọn môn học...</option>
                        {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.subjectName} ({sub.subjectCode})
                            </option>
                        ))}
                    </select>
                    {errors.subjectId && <p className="text-red-500 text-sm mt-1">{errors.subjectId.message}</p>}
                </div>

                {/* Document Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài liệu</label>
                    <select
                        {...register('documentType')}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                        <option value="">Chọn loại tài liệu...</option>
                        <option value={DocumentType.COURSE_BOOK}>Giáo trình</option>
                        <option value={DocumentType.SLIDE}>Slide bài giảng</option>
                        <option value={DocumentType.EXAM}>Đề thi</option>
                    </select>
                    {errors.documentType && <p className="text-red-500 text-sm mt-1">{errors.documentType.message}</p>}
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Tải lên tệp</span>
                            <input type="file" className="sr-only" onChange={onFileChange} accept=".pdf" />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PDF tối đa 50MB</p>

                    {file && (
                        <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm flex items-center justify-center">
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
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploadMutation.isPending && <Loader2 className="animate-spin h-4 w-4" />}
                        {uploadMutation.isPending ? 'Đang tải lên...' : 'Tải lên tài liệu'}
                    </button>
                </div>
            </form>
        </div>
    );
};
