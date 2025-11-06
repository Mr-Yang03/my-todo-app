/**
 * Deep Link Utilities
 * Tạo và xử lý deep links với custom domain (todo.com)
 */

import { getBaseUrl } from '../config/deepLinks';

export interface TodoDeepLinkParams {
  id: string;
  title?: string;
  description?: string;
}

export interface SearchParams {
  search?: string;
  page?: number;
  filter?: 'all' | 'completed' | 'pending';
}

/**
 * Tạo deep link cho todo
 * Example: https://todo.com/task/123/edit
 */
export function createTodoLink(params: TodoDeepLinkParams, customBaseUrl?: string): string {
  const base = customBaseUrl || getBaseUrl();
  return `${base}/task/${params.id}/edit`;
}

/**
 * Tạo deep link cho trang với query params
 * Example: https://todo.com/completed?search=work&page=2
 */
export function createPageLink(
  path: string,
  params?: SearchParams,
  customBaseUrl?: string
): string {
  const base = customBaseUrl || getBaseUrl();
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.search) searchParams.set('search', params.search);
    if (params.page && params.page > 1) searchParams.set('page', String(params.page));
    if (params.filter && params.filter !== 'all') searchParams.set('filter', params.filter);
  }

  const query = searchParams.toString();
  return `${base}${path}${query ? `?${query}` : ''}`;
}

/**
 * Copy link vào clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback cho browsers cũ
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Parse todo ID từ URL
 */
export function getTodoIdFromUrl(pathname: string): string | null {
  const match = pathname.match(/\/task\/([^\/]+)(?:\/edit|\/delete)?/);
  return match ? match[1] : null;
}

/**
 * Tạo shareable link với custom domain
 */
export function createShareableLink(
  todoId: string,
  title?: string,
  description?: string
): string {
  const link = createTodoLink({ id: todoId, title, description });
  return link;
}

/**
 * Get current page context từ URL
 */
export function getPageContext(pathname: string): {
  page: 'home' | 'completed' | 'pending';
  action?: 'create' | 'edit' | 'delete';
  todoId?: string;
} {
  let page: 'home' | 'completed' | 'pending' = 'home';
  let action: 'create' | 'edit' | 'delete' | undefined;
  let todoId: string | undefined;

  if (pathname.startsWith('/completed')) {
    page = 'completed';
  } else if (pathname.startsWith('/pending')) {
    page = 'pending';
  }

  if (pathname.includes('/create')) {
    action = 'create';
  } else if (pathname.includes('/edit')) {
    action = 'edit';
    todoId = getTodoIdFromUrl(pathname) || undefined;
  } else if (pathname.includes('/delete')) {
    action = 'delete';
    todoId = getTodoIdFromUrl(pathname) || undefined;
  }

  return { page, action, todoId };
}
