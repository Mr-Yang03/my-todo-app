export const DEEP_LINK_CONFIG = {
  baseUrl: import.meta.env.VITE_APP_BASE_URL || 'https://todo.com',
  
  shareText: {
    todo: 'Check out this todo',
    page: 'Share this page',
  },
};

export function getBaseUrl(): string {
  if (import.meta.env.VITE_APP_BASE_URL) {
    return import.meta.env.VITE_APP_BASE_URL;
  }
  
  if (typeof window !== 'undefined' && !import.meta.env.DEV) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  return 'https://todo.com';
}
