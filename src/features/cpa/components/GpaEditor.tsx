'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { SubjectResponse, subjectService } from '@/shared/api/subject.service';
import { Button } from '@/shared/ui/button/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command/command';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table/table';

import { calculateGPA } from '../utils/gpa-calculator';
import { gpaFormSchema, GpaFormValues } from '../validators/gpa.schema';

interface GpaEditorProps {
  initialData: GpaFormValues;
  onSave: (data: GpaFormValues) => Promise<void>;
}

export const GpaEditor = ({ initialData, onSave }: GpaEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<SubjectResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<GpaFormValues>({
    resolver: zodResolver(gpaFormSchema),
    defaultValues: initialData,
    mode: 'onBlur',
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
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

  useEffect(() => {
    if (!openSearch) return;

    const search = async () => {
      setIsSearching(true);
      try {
        const results = await subjectService.search({
          subjectName: debouncedSearch || '',
          limit: 10,
        });
        if (results && 'content' in results) {
          setSearchResults(results.content as SubjectResponse[]);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsSearching(false);
      }
    };
    search();
  }, [debouncedSearch, openSearch]);

  const handleAddSubject = (subject: SubjectResponse) => {
    // Prevent duplicates? logic if needed.
    // allow duplicates for now (e.g. retake)
    // Update: User requested to block duplicates in same semester
    const isDuplicate = fields.some((field) => field.subjectId === subject.id);
    if (isDuplicate) {
      toast.error('Môn học này đã được chọn trong kỳ này.');
      return;
    }

    append({
      subjectId: subject.id,
      name: subject.subjectName,
      credit: subject.credit || 0, // Fallback
      letterScore: '',
    });
    setOpenSearch(false);
    setSearchTerm('');
  };

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
          <span className="block text-sm text-gray-500 dark:text-gray-400">Tín chỉ tích lũy</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalCredits}
          </span>
        </div>
        <div>
          <span className="block text-sm text-gray-500 dark:text-gray-400">GPA Dự tính</span>
          <span
            className={`text-2xl font-bold ${stats.gpa < 2.0 ? 'text-red-500' : 'text-green-600'}`}
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Chưa có môn học nào. Hãy thêm môn học mới.
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, index) => (
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
                                onValueChange={(val) =>
                                  formField.onChange(val === 'unselected' ? '' : val)
                                }
                                defaultValue={formField.value || 'unselected'}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="-" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="unselected">-</SelectItem>
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
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ADD SUBJECT BUTTON */}
          <div className="flex items-center justify-between">
            <Popover open={openSearch} onOpenChange={setOpenSearch}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openSearch}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm môn học
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Tìm môn học..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    {isSearching && <div className="p-4 text-center text-sm">Đang tìm...</div>}
                    {!isSearching && searchResults.length === 0 && (
                      <CommandEmpty>Không tìm thấy môn học.</CommandEmpty>
                    )}
                    {searchResults.map((subject) => (
                      <CommandItem
                        key={subject.id}
                        value={subject.subjectName}
                        onSelect={() => handleAddSubject(subject)}
                      >
                        <div className="flex flex-col">
                          <span>{subject.subjectName}</span>
                          <span className="text-xs text-gray-500">
                            {subject.subjectCode} - {subject.credit} TC
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

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
