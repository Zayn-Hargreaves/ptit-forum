import { apiClient } from '@shared/api/axios-client';
import { ApiResponse, PageResponse } from '@shared/api/types';

import { ProcessReportRequest, ReportDTO } from '../model/types';

export const reportModerationApi = {
  getTopicReports: async (topicId: string, status?: string, page = 0, size = 10) => {
    const params: Record<string, unknown> = {
      page,
      size,
    };
    if (status) {
      params.status = status;
    }

    const { data } = await apiClient.get<ApiResponse<PageResponse<ReportDTO>>>(
      `/reports/topic/${topicId}`,
      {
        params,
      },
    );
    return data.result;
  },

  processReport: async (reportId: string, payload: ProcessReportRequest) => {
    const { data } = await apiClient.patch<ApiResponse<ReportDTO>>(
      `/reports/${reportId}/process`,
      payload,
    );
    return data.result;
  },
};
