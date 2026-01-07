import { UserPostsList } from "@features/dashboard/posts/ui/user-posts-list";
import { Button } from "@shared/ui";
import Link from "next/link";
import { PenSquare } from "lucide-react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@shared/lib/query/get-query-client";
import { postApi } from "@entities/post/api/post-api";

export default async function DashboardPostsPage() {
    const queryClient = getQueryClient();

    // Prefetch first page
    await queryClient.prefetchQuery({
        queryKey: ["my-posts", 0],
        queryFn: () => postApi.getMyPosts(0, 10),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Posts</h2>
                    <p className="text-muted-foreground">Manage your forum discussions and interactions.</p>
                </div>
                <Button asChild>
                    <Link href="/forum">
                        <PenSquare className="nr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <UserPostsList />
            </HydrationBoundary>
        </div>
    );
}
