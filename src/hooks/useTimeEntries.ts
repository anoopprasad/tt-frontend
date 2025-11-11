// Time entries hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { TimeEntry } from '../types';

export const useTimeEntries = (filters?: {
  startDate?: string;
  endDate?: string;
  projectId?: number;
  clientId?: number;
  tagIds?: number[];
  teamIds?: number[];
  isBillable?: boolean;
}) => {
  return useQuery({
    queryKey: ['timeEntries', filters],
    queryFn: async () => {
      const response = await apiClient.get<TimeEntry[]>('/time_entries', { params: filters });
      return response.data;
    },
  });
};

export const useTimeEntry = (id: number) => {
  return useQuery({
    queryKey: ['timeEntry', id],
    queryFn: async () => {
      const response = await apiClient.get<TimeEntry>(`/time_entries/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TimeEntry>) => {
      const response = await apiClient.post<TimeEntry>('/time_entries', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<TimeEntry> & { id: number }) => {
      const response = await apiClient.put<TimeEntry>(`/time_entries/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/time_entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useStopTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.post<TimeEntry>(`/time_entries/${id}/stop`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
