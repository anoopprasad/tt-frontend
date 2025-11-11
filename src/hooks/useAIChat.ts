// AI Chat hooks

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../services/api';

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
}

export const useAIChat = () => {
  return useMutation({
    mutationFn: async (data: ChatRequest) => {
      const response = await apiClient.post<ChatResponse>('/ai/chat', data);
      return response.data;
    },
  });
};
