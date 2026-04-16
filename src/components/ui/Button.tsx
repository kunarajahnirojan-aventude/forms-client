import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils';

const variantClasses = {
  primary:
    'bg-[#0B1AA0] text-white hover:bg-[#0a179a] focus-visible:ring-[#0B1AA0]',
  secondary:
    'bg-muted text-foreground border border-input hover:bg-muted/80 focus-visible:ring-ring',
  ghost: 'text-foreground hover:bg-muted focus-visible:ring-ring',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
} as const;

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
