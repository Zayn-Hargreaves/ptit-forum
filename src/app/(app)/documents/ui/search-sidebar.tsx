"use client";

import { Check, Loader2, Search, X } from "lucide-react";
import { Button, Input, ScrollArea, Label, RadioGroup, RadioGroupItem, Checkbox } from "@shared/ui";
import { Subject } from "@/entities/subject/api/subject-api";
import { useDocumentFilters } from "@/features/discovery/hooks/use-document-filters";
import { DocumentType } from "@/entities/document/model/schema";
import { useDebouncedCallback } from "use-debounce";

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
        [DocumentType.COURSE_BOOK]: "Giáo trình",
        [DocumentType.SLIDE]: "Slide bài giảng",
        [DocumentType.EXAM]: "Đề thi",
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Tìm kiếm</h3>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm tài liệu..."
                        className="pl-9"
                        defaultValue={initialFilters.q}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Môn học</h3>
                    {filters.subjectId && (
                        <Button variant="ghost" size="sm" onClick={() => setSubject(null)} className="h-auto p-0 text-muted-foreground">
                            Xóa
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[300px] pr-4">
                    <RadioGroup value={filters.subjectId || ""} onValueChange={(val) => setSubject(val === filters.subjectId ? null : val)}>
                        {subjects.map((subject) => (
                            <div key={subject.id} className="flex items-center space-x-2 mb-2">
                                <RadioGroupItem value={subject.id} id={subject.id} />
                                <Label htmlFor={subject.id} className="text-sm font-normal cursor-pointer">
                                    {subject.subjectName}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </ScrollArea>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Loại tài liệu</h3>
                    {filters.type && (
                        <Button variant="ghost" size="sm" onClick={() => setType(null)} className="h-auto p-0 text-muted-foreground">
                            Xóa
                        </Button>
                    )}
                </div>
                <RadioGroup value={filters.type || ""} onValueChange={(val) => setType(val === filters.type ? null : val)}>
                    {Object.values(DocumentType).map((type) => (
                        <div key={type} className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
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
