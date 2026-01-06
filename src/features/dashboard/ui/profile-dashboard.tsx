'use client';

import { Button } from '@shared/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card/card';
import { Eye, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function ProfileDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/documents/upload">Upload Document</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploaded Documents</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-muted-foreground text-xs">+0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-muted-foreground text-xs">+0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-muted-foreground text-xs">Across all content</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground py-10 text-center text-sm">
              No recent activity to show.
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/dashboard/documents">Manage Documents</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/dashboard/posts">Manage Posts</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/dashboard/settings">Profile Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
