'use client';

import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { reportModerationApi } from '../api/report-moderation-api';
import { ProcessReportRequest, ReportStatus } from '../model/types';
import { ReportItem } from './report-item';

interface ReportListProps {
  topicId: string;
}

export function ReportList({ topicId }: Readonly<ReportListProps>) {
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'ALL'>(ReportStatus.PENDING);
  const queryClient = useQueryClient();

  // Query Reports
  const { data: reportPage, isLoading } = useQuery({
    queryKey: ['topic-reports', topicId, filterStatus],
    queryFn: () =>
      reportModerationApi.getTopicReports(
        topicId,
        filterStatus === 'ALL' ? undefined : filterStatus,
      ),
  });

  // Process Mutation
  const { mutate: processReport, isPending: isProcessing } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessReportRequest }) =>
      reportModerationApi.processReport(id, data),
    onSuccess: () => {
      toast.success('Đã xử lý báo cáo thành công');
      queryClient.invalidateQueries({ queryKey: ['topic-reports', topicId] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xử lý báo cáo');
    },
  });

  const handleProcess = (reportId: string, data: ProcessReportRequest) => {
    processReport({ id: reportId, data });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quản lý báo cáo</h3>
        <Tabs
          value={filterStatus}
          onValueChange={(val) => setFilterStatus(val as ReportStatus | 'ALL')}
        >
          <TabsList>
            <TabsTrigger value={ReportStatus.PENDING}>Chờ xử lý</TabsTrigger>
            <TabsTrigger value="ALL">Lịch sử</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="text-muted-foreground animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {reportPage?.content.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Không có báo cáo nào.</p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reportPage?.content.map((report: any) => (
              <ReportItem
                key={report.id}
                report={report}
                onProcess={handleProcess}
                isProcessing={isProcessing}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
