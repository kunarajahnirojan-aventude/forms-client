import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosInstance } from '@/config/axios';
import { useAuth } from '@/store';
import { ROUTES } from '@/router/routes';
import type { LoginFormValues } from '@/libs/auth/ui/login';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
  token: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post<LoginResponse>(
        '/auth/login',
        values,
      );

      login(data.user, data.token);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string })?.message ??
          'Invalid email or password';
        setError(message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { handleLogin, isLoading, error };
}
