// Tags hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { Tag } from '../types';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await apiClient.get<Tag[]>('/tags');
      return response.data;
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Tag>) => {
      const response = await apiClient.post<Tag>('/tags', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Tag> & { id: number }) => {
      const response = await apiClient.put<Tag>(`/tags/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
