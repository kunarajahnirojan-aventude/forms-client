import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@/components';

// ---------------------------------------------------------------------------
// Zod schema (co-located with the form)
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-5'>
      <Input
        label='Email address'
        type='email'
        autoComplete='email'
        placeholder='you@example.com'
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label='Password'
        type='password'
        autoComplete='current-password'
        placeholder='••••••••'
        error={errors.password?.message}
        {...register('password')}
      />

      {error && (
        <p
          role='alert'
          className='rounded-md bg-red-50 px-3 py-2 text-sm text-red-700'
        >
          {error}
        </p>
      )}

      <Button
        type='submit'
        className='w-full'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign in
      </Button>
    </form>
  );
}
