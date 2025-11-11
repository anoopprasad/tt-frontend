// Auth hooks using React Query

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import type { LoginCredentials, SignupData } from '../types';

export const useLogin = () => {
  const { login } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await login(credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useSignup = () => {
  const { signup } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      await signup(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
