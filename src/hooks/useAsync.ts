/**
 * 加载状态管理 Hook
 * 用于管理异步操作的加载、成功、错误状态
 */

import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  progress: number; // 0-100
}

export interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const useAsync = (options: UseAsyncOptions = {}) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    progress: 0,
  });

  const execute = useCallback(
    async (asyncFunction: () => Promise<any>) => {
      setState({ isLoading: true, error: null, progress: 0 });

      try {
        const result = await asyncFunction();
        setState({ isLoading: false, error: null, progress: 100 });
        options.onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ isLoading: false, error: err, progress: 0 });
        options.onError?.(err);
        throw err;
      }
    },
    [options]
  );

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
    options.onProgress?.(progress);
  }, [options]);

  return {
    ...state,
    execute,
    setProgress,
  };
};
