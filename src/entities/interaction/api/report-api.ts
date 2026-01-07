import { apiClient } from '@shared/api/axios-client';
import { ApiResponse } from '@shared/api/types';

import { ReportRequest } from '../model/types';

export const reportApi = {
  create: async (payload: ReportRequest) => {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/reports', payload);
    return data.result;
  },
};
