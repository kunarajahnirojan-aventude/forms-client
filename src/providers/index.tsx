import { type ReactNode } from 'react';
import { App } from '@/App';

interface AppProvidersProps {
  /** Optionally override children (useful for testing). */
  children?: ReactNode;
}

/**
 * AppProviders wraps the entire application with all necessary context
 * providers. Add new providers here (e.g. QueryClientProvider, Toaster,
 * ThemeProvider) to keep `main.tsx` clean.
 */
export function AppProviders({ children }: AppProvidersProps) {
  // Future providers go here:
  // return (
  //   <QueryClientProvider client={queryClient}>
  //     {children ?? <App />}
  //   </QueryClientProvider>
  // )

  return <>{children ?? <App />}</>;
}
