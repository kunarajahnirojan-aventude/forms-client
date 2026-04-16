/**
 * Typed application configuration sourced from Vite environment variables.
 * Add new env vars to `.env.example` and declare them in `vite-env.d.ts`.
 */
export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'Forms Client',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  /** Axios timeout in milliseconds */
  requestTimeout: 15_000,
} as const;

export type AppConfig = typeof appConfig;
