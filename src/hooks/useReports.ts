// Reports hooks

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { ReportData } from '../types';

export const useReports = (filters?: {
  startDate?: string;
  endDate?: string;
  projectId?: number;
  clientId?: number;
  tagIds?: number[];
  teamIds?: number[];
  isBillable?: boolean;
}) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const response = await apiClient.get<ReportData>('/reports', { params: filters });
      return response.data;
    },
  });
};
