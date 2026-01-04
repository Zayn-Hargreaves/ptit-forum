'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadDocument } from '../model/use-upload-document';
import { subjectService, SubjectResponse } from '@/shared/api/subject.service';
import { Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';

const uploadSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    subjectId: z.string().min(1, 'Please select a subject'),
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
                alert('Only PDF files are allowed');
                e.target.value = ''; // Reset input
                return;
            }
            if (selectedFile.size > 50 * 1024 * 1024) {
                alert('File size must be less than 50MB');
                e.target.value = '';
                return;
            }
            setFile(selectedFile);
        }
    };

    const onSubmit = (data: FormData) => {
        if (!file) {
            alert('Please select a file');
            return;
        }
        uploadMutation.mutate({ ...data, file });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Document</h2>

            {uploadMutation.isError && (
                <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                    Upload failed. Please try again. {(uploadMutation.error as any)?.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        {...register('title')}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. Advanced Calculus Midterm 2024"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Describe the content of the document..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                        {...register('subjectId')}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        disabled={isLoadingSubjects}
                    >
                        <option value="">Select a subject...</option>
                        {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name} ({sub.code})
                            </option>
                        ))}
                    </select>
                    {errors.subjectId && <p className="text-red-500 text-sm mt-1">{errors.subjectId.message}</p>}
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" onChange={onFileChange} accept=".pdf" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PDF up to 50MB</p>

                    {file && (
                        <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm flex items-center justify-center">
                            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/documents" className="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={uploadMutation.isPending}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploadMutation.isPending && <Loader2 className="animate-spin h-4 w-4" />}
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
                    </button>
                </div>
            </form>
        </div>
    );
};
