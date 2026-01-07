'use client';

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui';
import { ChevronLeft, ChevronRight, FileX } from 'lucide-react';

import { Document } from '@/entities/document/model/schema';
import { DocumentCard } from '@/entities/document/ui/document-card';
import { useDocumentFilters } from '@/features/discovery/hooks/use-document-filters';

interface DocumentGridProps {
  documents: Document[];
  total: number;
  currentPage: number;
  currentSort: string;
}

export function DocumentGrid({ documents, total, currentPage, currentSort }: DocumentGridProps) {
  const { setSort, setPage, clearFilters } = useDocumentFilters();

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground text-sm">
          Hiển thị {documents.length > 0 ? (currentPage - 1) * 12 + 1 : 0} -{' '}
          {Math.min(currentPage * 12, total)} trong tổng số {total} tài liệu
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sắp xếp theo:</span>
          <Select value={currentSort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt,desc">Mới nhất</SelectItem>
              <SelectItem value="createdAt,asc">Cũ nhất</SelectItem>
              <SelectItem value="viewCount,desc">Xem nhiều nhất</SelectItem>
              <SelectItem value="downloadCount,desc">Tải nhiều nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileX className="text-muted-foreground mb-4 h-16 w-16" />
          <h3 className="mb-2 text-xl font-semibold">Không tìm thấy tài liệu</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Chúng tôi không tìm thấy tài liệu nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh
            tiêu chí tìm kiếm.
          </p>
          <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
