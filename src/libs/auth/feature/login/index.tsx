import { LoginForm } from '@/libs/auth/ui/login';
import { useLogin } from '@/libs/auth/feature/hooks';

export default function LoginPage() {
  const { handleLogin, isLoading, error } = useLogin();

  return (
    <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
  );
}
