/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsyncState = <T>(initialData: T | null = null) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return { ...state, execute, reset };
};
