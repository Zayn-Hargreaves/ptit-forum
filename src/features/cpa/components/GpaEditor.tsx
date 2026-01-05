'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateGPA } from '../utils/gpa-calculator';
import { GpaFormValues, gpaFormSchema } from '../validators/gpa.schema';
import { Button } from '@/shared/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/shared/ui/form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface GpaEditorProps {
    initialData: GpaFormValues;
    onSave: (data: GpaFormValues) => Promise<void>;
}

export const GpaEditor = ({ initialData, onSave }: GpaEditorProps) => {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<GpaFormValues>({
        resolver: zodResolver(gpaFormSchema),
        defaultValues: initialData,
        mode: 'onBlur',
    });

    const { control, handleSubmit } = form;

    const { fields } = useFieldArray({
        control,
        name: 'subjects',
    });

    const watchedSubjects = useWatch({
        control,
        name: 'subjects',
    });

    // Calculate stats based on watched values or initial values if not yet watched
    const subjectsToCalculate = watchedSubjects || initialData.subjects;
    const stats = calculateGPA(subjectsToCalculate);

    const onSubmit = async (data: GpaFormValues) => {
        setIsSaving(true);
        try {
            await onSave(data);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER STATS */}
            <div className="flex gap-8 rounded-lg bg-blue-50 p-4 shadow-sm dark:bg-blue-900/20">
                <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                        Tín chỉ tích lũy
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.totalCredits}
                    </span>
                </div>
                <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                        GPA Dự tính
                    </span>
                    <span
                        className={`text-2xl font-bold ${stats.gpa < 2.0 ? 'text-red-500' : 'text-green-600'
                            }`}
                    >
                        {stats.gpa}
                    </span>
                </div>
            </div>

            {/* FORM */}
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Môn học</TableHead>
                                    <TableHead>Tín chỉ</TableHead>
                                    <TableHead>Điểm</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell className="font-medium">{field.name}</TableCell>
                                        <TableCell>{field.credit}</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`subjects.${index}.letterScore`}
                                                render={({ field: formField }) => (
                                                    <FormItem>
                                                        <Select
                                                            onValueChange={formField.onChange}
                                                            defaultValue={formField.value || ''}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-[100px]">
                                                                    <SelectValue placeholder="-" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="">-</SelectItem>
                                                                <SelectItem value="A+">A+</SelectItem>
                                                                <SelectItem value="A">A</SelectItem>
                                                                <SelectItem value="B+">B+</SelectItem>
                                                                <SelectItem value="B">B</SelectItem>
                                                                <SelectItem value="C+">C+</SelectItem>
                                                                <SelectItem value="C">C</SelectItem>
                                                                <SelectItem value="D+">D+</SelectItem>
                                                                <SelectItem value="D">D</SelectItem>
                                                                <SelectItem value="F">F</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu Bảng Điểm
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
