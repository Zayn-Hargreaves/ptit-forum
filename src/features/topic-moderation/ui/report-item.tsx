'use client';

import { stripHtml } from '@shared/lib/html-utils';
import { getAvatarUrl, getUserDisplayName, getUserInitials } from '@shared/lib/user-display-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar/avatar';
import { Badge } from '@shared/ui/badge/badge';
import { Button } from '@shared/ui/button/button';
import { Card, CardContent, CardFooter, CardHeader } from '@shared/ui/card/card';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertTriangle, Clock, MessageSquare, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';

import { ProcessReportRequest, ReportAction, ReportDTO, ReportStatus } from '../model/types';
import { ResolveReportDialog } from './resolve-report-dialog';

interface ReportItemProps {
  report: ReportDTO;
  onProcess: (reportId: string, data: ProcessReportRequest) => void;
  isProcessing: boolean;
}

export function ReportItem({ report, onProcess, isProcessing }: Readonly<ReportItemProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ReportAction | null>(null);

  const handleActionClick = (action: ReportAction) => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = (data: ProcessReportRequest) => {
    onProcess(report.id, data);
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={getAvatarUrl(report.reporterAvatarUrl)} />
              <AvatarFallback>{getUserInitials(report.reporterFullName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {getUserDisplayName(report.reporterFullName)}
              </span>
              <span className="text-muted-foreground flex items-center text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: vi })}
              </span>
            </div>
          </div>
          <Badge variant={report.status === ReportStatus.PENDING ? 'outline' : 'secondary'}>
            {report.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {/* Reason Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
              <AlertTriangle className="h-4 w-4" />
              Lý do: {report.reason}
            </div>
            {report.description && (
              <p className="text-muted-foreground pl-6 text-sm">&quot;{report.description}&quot;</p>
            )}
          </div>

          {/* Content Preview Section */}
          <div className="bg-background rounded-md border p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
              {report.targetType === 'POST' ? (
                <MessageSquare className="h-3 w-3" />
              ) : (
                <MessageSquare className="h-3 w-3" />
              )}
              Nội dung bị báo cáo ({report.targetType})
            </div>
            <div
              className="prose prose-sm dark:prose-invert text-muted-foreground line-clamp-3 max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: stripHtml(report.targetPreview ?? 'Nội dung không khả dụng'),
              }}
            />
          </div>
        </CardContent>

        {report.status === ReportStatus.PENDING && (
          <CardFooter className="bg-muted/20 flex justify-end gap-2 p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleActionClick(ReportAction.KEEP_CONTENT)}
              disabled={isProcessing}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Bỏ qua (Giữ bài)
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleActionClick(ReportAction.DELETE_CONTENT)}
              disabled={isProcessing}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa nội dung
            </Button>
          </CardFooter>
        )}
      </Card>

      <ResolveReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={selectedAction}
        isPending={isProcessing}
        onSubmit={handleConfirm}
      />
    </>
  );
}
