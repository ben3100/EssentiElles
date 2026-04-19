/**
 * Custom hook for API calls with loading and error states
 */
import { useState, useCallback } from 'react';
import { ApiError } from '../services/apiClient';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for managing API call states
 * 
 * @example
 * const { data, loading, error, execute } = useApi(
 *   (id: string) => apiClient.get(`/products/${id}`)
 * );
 * 
 * useEffect(() => {
 *   execute('product-123');
 * }, []);
 */
export function useApi<T = any>(
  apiFunc: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiFunc(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        setState({ data: null, loading: false, error: apiError });
        return null;
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 * Similar to useApi but optimized for mutations
 */
export function useMutation<T = any, Args = any>(
  mutationFunc: (args: Args) => Promise<T>
): UseApiReturn<T> & { mutate: (args: Args) => Promise<T | null> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (args: Args): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await mutationFunc(args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({ ...prev, loading: false, error: apiError }));
        return null;
      }
    },
    [mutationFunc]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute: mutate,
    mutate,
    reset,
  };
}
