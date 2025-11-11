// Projects hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { Project } from '../types';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get<Project[]>('/projects');
      return response.data;
    },
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await apiClient.get<Project>(`/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const response = await apiClient.post<Project>('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: number }) => {
      const response = await apiClient.put<Project>(`/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
