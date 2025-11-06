import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createTodoLink,
  createPageLink,
  copyToClipboard,
  getPageContext,
  SearchParams,
} from '../utils/deepLinks';
import { getBaseUrl } from '../config/deepLinks';

export interface UseDeepLinkReturn {
  copyTodoLink: (todoId: string) => Promise<boolean>;
  copyCurrentPageLink: () => Promise<boolean>;
  
  getTodoLink: (todoId: string) => string;
  getPageLink: (params?: SearchParams) => string;
  getCurrentPageFullUrl: () => string;
  
  isCopied: boolean;
  copiedLink: string | null;
  
  pageContext: ReturnType<typeof getPageContext>;
  
  baseUrl: string;
}

export function useDeepLink(): UseDeepLinkReturn {
  const location = useLocation();
  const [isCopied, setIsCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const pageContext = getPageContext(location.pathname);
  const baseUrl = getBaseUrl();

  const copyTodoLink = useCallback(async (todoId: string): Promise<boolean> => {
    const link = createTodoLink({ id: todoId });
    const success = await copyToClipboard(link);
    
    if (success) {
      setIsCopied(true);
      setCopiedLink(link);
      
      setTimeout(() => {
        setIsCopied(false);
        setCopiedLink(null);
      }, 3000);
    }
    
    return success;
  }, []);

  const copyCurrentPageLink = useCallback(async (): Promise<boolean> => {
    const currentPath = location.pathname + location.search;
    const link = `${baseUrl}${currentPath}`;
    const success = await copyToClipboard(link);
    
    if (success) {
      setIsCopied(true);
      setCopiedLink(link);
      
      setTimeout(() => {
        setIsCopied(false);
        setCopiedLink(null);
      }, 3000);
    }
    
    return success;
  }, [location.pathname, location.search, baseUrl]);

  const getTodoLink = useCallback((todoId: string): string => {
    return createTodoLink({ id: todoId });
  }, []);

  const getPageLink = useCallback((params?: SearchParams): string => {
    return createPageLink(location.pathname, params);
  }, [location.pathname]);

  const getCurrentPageFullUrl = useCallback((): string => {
    return `${baseUrl}${location.pathname}${location.search}`;
  }, [baseUrl, location.pathname, location.search]);

  return {
    copyTodoLink,
    copyCurrentPageLink,
    getTodoLink,
    getPageLink,
    getCurrentPageFullUrl,
    isCopied,
    copiedLink,
    pageContext,
    baseUrl,
  };
}
