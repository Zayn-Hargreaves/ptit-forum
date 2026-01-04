import { UserDocumentsTable } from "@features/dashboard/documents/ui/user-docs-table";
import { Button } from "@shared/ui";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@shared/lib/query/get-query-client";
import { getMyDocuments } from "@shared/api/document.service";

export default async function DashboardDocumentsPage() {
    const queryClient = getQueryClient();

    // Prefetch first page
    await queryClient.prefetchQuery({
        queryKey: ["my-documents", { pageIndex: 0, pageSize: 10 }, "ALL", "", []],
        queryFn: () =>
            getMyDocuments({
                page: 1,
                limit: 10,
            }),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Documents</h2>
                    <p className="text-muted-foreground">Manage your uploaded materials and check their status.</p>
                </div>
                <Button asChild>
                    <Link href="/documents/upload">
                        <PlusCircle className="nr-2 h-4 w-4" />
                        Upload New
                    </Link>
                </Button>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <UserDocumentsTable />
            </HydrationBoundary>
        </div>
    );
}
