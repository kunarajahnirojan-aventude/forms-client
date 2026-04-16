import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/store';
import { ROUTES } from '@/router/routes';

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            Forms Client
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Sign in to your account to continue
          </p>
        </div>

        <div className='rounded-xl border bg-card p-8 shadow-sm'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
