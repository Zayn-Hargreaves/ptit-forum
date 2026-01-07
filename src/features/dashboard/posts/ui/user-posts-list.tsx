"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@entities/post/api/post-api";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
} from "@shared/ui";
import { format } from "date-fns";
import { MessageSquare, Eye, ThumbsUp, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function UserPostsList() {
    const [page, setPage] = useState(0);
    const queryClient = useQueryClient();

    const { data: postsData, isLoading } = useQuery({
        queryKey: ["my-posts", page],
        queryFn: () => postApi.getMyPosts(page, 10),
    });

    const posts = postsData?.content || [];
    const totalPages = postsData?.totalPages || 0;

    const deleteMutation = useMutation({
        mutationFn: postApi.delete,
        onSuccess: () => {
            toast.success("Post deleted");
            queryClient.invalidateQueries({ queryKey: ["my-posts"] });
        },
        onError: () => {
            toast.error("Failed to delete post");
        }
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            deleteMutation.mutate(id);
        }
    }

    if (isLoading) return <div>Loading posts...</div>;

    if (posts.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/10">
                You haven't posted anything yet.
                <br />
                <Button variant="link" asChild>
                    <Link href="/forum">Go to Forum</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Link href={`/forum/post/${post.id}`} className="font-semibold hover:underline line-clamp-1 text-lg">
                                        {post.title}
                                    </Link>
                                    <Badge variant="secondary" className="text-xs">{post.topic?.name || 'General'}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>{format(new Date(post.createdDateTime), "MMM dd, yyyy")}</span>
                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.stats.viewCount}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.stats.commentCount}</span>
                                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {post.stats.reactionCount}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/forum/post/${post.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(post.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
                    <span className="text-sm py-2">Page {page + 1} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</Button>
                </div>
            )}
        </div>
    );
}
