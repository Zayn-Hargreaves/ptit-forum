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
import { format } from 'date-fns';

import { AnnouncementResponse } from '@/entities/announcement/model/types';

export function LatestAnnouncementsTable({
  announcements,
}: {
  announcements: AnnouncementResponse[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell
                  className="max-w-[200px] truncate font-medium"
                  title={announcement.title}
                >
                  {announcement.title}
                </TableCell>
                <TableCell>{announcement.announcementType}</TableCell>
                <TableCell>
                  {announcement.createdDate
                    ? format(new Date(announcement.createdDate), 'yyyy-MM-dd')
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
