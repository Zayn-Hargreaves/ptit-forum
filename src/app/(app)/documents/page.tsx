import { SearchSidebar } from "./ui/search-sidebar";
import { DocumentGrid } from "./ui/document-grid";
import { getDocuments } from "@/shared/api/document.service";
import { subjectApi } from "@/entities/subject/api/subject-api";
import { parsePage, parseString } from "@/shared/utils/search-params";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocumentsPage({ searchParams }: PageProps) {
    const params = await searchParams; // Next.js 15 requires awaiting searchParams

    // 1. Parse params locally safely
    const page = parsePage(params.page);
    const filters = {
        q: parseString(params.q) || "",
        subjectId: parseString(params.subjectId),
        type: parseString(params.type),
        sort: parseString(params.sort) || 'createdAt,desc',
        page: page,
        limit: 12,
    };

    // 2. Parallel Data Fetching
    const [documentsData, subjects] = await Promise.all([
        getDocuments(filters),
        subjectApi.getAll()
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Documents Library</h1>
                <p className="text-muted-foreground">
                    Browse and search through our collection of study materials, exams, and lecture notes.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    <SearchSidebar subjects={subjects} initialFilters={filters} />
                </aside>

                <main className="flex-1 min-w-0">
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
