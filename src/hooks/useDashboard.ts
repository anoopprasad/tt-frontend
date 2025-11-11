// Dashboard hooks

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { DashboardSummary } from '../types';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
      return response.data;
    },
  });
};
