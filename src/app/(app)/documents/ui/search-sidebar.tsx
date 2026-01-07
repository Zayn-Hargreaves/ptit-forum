'use client';

import { Button, Input, Label, RadioGroup, RadioGroupItem, ScrollArea } from '@shared/ui';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { DocumentType } from '@/entities/document/model/schema';
import { Subject } from '@/entities/subject/api/subject-api';
import { useDocumentFilters } from '@/features/discovery/hooks/use-document-filters';

interface SearchSidebarProps {
  subjects: Subject[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFilters: any;
}

export function SearchSidebar({ subjects, initialFilters }: SearchSidebarProps) {
  const { filters, setSubject, setType, clearFilters, setSearch } = useDocumentFilters();

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearch(term);
  }, 500);

  // Vietnamese mapping for DocumentType
  const documentTypeLabels: Record<DocumentType, string> = {
    [DocumentType.COURSE_BOOK]: 'Giáo trình',
    [DocumentType.SLIDE]: 'Slide bài giảng',
    [DocumentType.EXAM]: 'Đề thi',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Tìm kiếm</h3>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="pl-9"
            defaultValue={initialFilters.q}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Môn học</h3>
          {filters.subjectId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubject(null)}
              className="text-muted-foreground h-auto p-0"
            >
              Xóa
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <RadioGroup
            value={filters.subjectId || ''}
            onValueChange={(val) => setSubject(val === filters.subjectId ? null : val)}
          >
            {subjects.map((subject) => (
              <div key={subject.id} className="mb-2 flex items-center space-x-2">
                <RadioGroupItem value={subject.id} id={subject.id} />
                <Label htmlFor={subject.id} className="cursor-pointer text-sm font-normal">
                  {subject.subjectName}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Loại tài liệu</h3>
          {filters.type && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setType(null)}
              className="text-muted-foreground h-auto p-0"
            >
              Xóa
            </Button>
          )}
        </div>
        <RadioGroup
          value={filters.type || ''}
          onValueChange={(val) => setType(val === filters.type ? null : val)}
        >
          {Object.values(DocumentType).map((type) => (
            <div key={type} className="mb-2 flex items-center space-x-2">
              <RadioGroupItem value={type} id={type} />
              <Label htmlFor={type} className="cursor-pointer text-sm font-normal">
                {documentTypeLabels[type]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Đặt lại bộ lọc
      </Button>
    </div>
  );
}
