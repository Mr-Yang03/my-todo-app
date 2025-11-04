import { useSearchParams as useRouterSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

export function useSearchParams<T extends Record<string, any>>(
  defaultValues: T
): [T, (updates: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useRouterSearchParams();

  const params = useMemo(() => {
    const result: any = { ...defaultValues };
    
    Object.keys(defaultValues).forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        const defaultValue = defaultValues[key];
        
        // Type conversion based on default value type
        if (typeof defaultValue === 'number') {
          result[key] = parseInt(value, 10);
        } else if (typeof defaultValue === 'boolean') {
          result[key] = value === 'true';
        } else {
          result[key] = value;
        }
      }
    });
    
    return result as T;
  }, [searchParams, defaultValues]);

  const updateParams = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams);
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return [params, updateParams];
}
