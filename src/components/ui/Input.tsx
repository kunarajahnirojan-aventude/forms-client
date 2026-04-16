import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className='flex flex-col gap-1.5'>
        {label && (
          <label
            htmlFor={id}
            className='text-sm font-medium leading-none text-foreground'
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-10 w-full rounded-md border bg-card px-3 text-sm text-foreground',
            'placeholder:text-muted-foreground',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1AA0] focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-input',
            className,
          )}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className='text-xs text-muted-foreground'>
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role='alert' className='text-xs text-red-600'>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
