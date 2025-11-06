export const DEEP_LINK_CONFIG = {
  baseUrl: process.env.REACT_APP_BASE_URL || 'https://todo.com',
  
  shareText: {
    todo: 'Check out this todo',
    page: 'Share this page',
  },
};

export function getBaseUrl(): string {
  if (process.env.REACT_APP_BASE_URL) {
    return process.env.REACT_APP_BASE_URL;
  }
  
  // Development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production - custom domain
  return 'https://todo.com';
}
