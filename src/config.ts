// Centralized, minimal runtime configuration for the frontend app.

const getApiBaseUrl = (): string => {
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  if (import.meta.env.DEV) {
    // Sensible default for local development if not provided via env
    return 'http://localhost:3000';
  }

  // In production, an explicit URL is required to avoid accidental localhost usage
  throw new Error('VITE_API_URL is required in production builds');
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
} as const;
