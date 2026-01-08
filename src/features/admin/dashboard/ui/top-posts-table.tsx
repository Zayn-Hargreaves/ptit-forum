'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/ui';

import { IPost } from '@/entities/post/model/types';

export function TopPostsTable({ posts }: { posts: IPost[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Reacted Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Reactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-[200px] truncate font-medium" title={post.title}>
                  {post.title}
                </TableCell>
                <TableCell>{post.author?.fullName || 'Unknown'}</TableCell>
                <TableCell className="text-right">{post.reactionCount || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
