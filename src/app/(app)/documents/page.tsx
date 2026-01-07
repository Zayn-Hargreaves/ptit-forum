import { subjectApi } from '@/entities/subject/api/subject-api';
import { getDocuments } from '@/shared/api/document.service';
import { parsePage, parseString } from '@/shared/utils/search-params';

import { DocumentGrid } from './ui/document-grid';
import { SearchSidebar } from './ui/search-sidebar';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const params = await searchParams; // Next.js 15 requires awaiting searchParams

  // 1. Parse params locally safely
  const page = parsePage(params.page);
  const filters = {
    q: parseString(params.q) || '',
    subjectId: parseString(params.subjectId),
    type: parseString(params.type),
    sort: parseString(params.sort) || 'createdAt,desc',
    page: page,
    limit: 12,
  };

  // 2. Parallel Data Fetching
  const [documentsData, subjects] = await Promise.all([getDocuments(filters), subjectApi.getAll()]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Thư Viện Tài Liệu</h1>
        <p className="text-muted-foreground">
          Duyệt và tìm kiếm qua bộ sưu tập tài liệu học tập, đề thi và bài giảng của chúng tôi.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 space-y-8 lg:w-64">
          <SearchSidebar subjects={subjects} initialFilters={filters} />
        </aside>

        <main className="min-w-0 flex-1">
          <DocumentGrid
            documents={documentsData.data}
            total={documentsData.total}
            currentPage={page}
            currentSort={filters.sort}
          />
        </main>
      </div>
    </div>
  );
}
