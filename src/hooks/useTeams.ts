// Teams hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { Team } from '../types';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await apiClient.get<Team[]>('/teams');
      return response.data;
    },
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Team>) => {
      const response = await apiClient.post<Team>('/teams', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Team> & { id: number }) => {
      const response = await apiClient.put<Team>(`/teams/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
