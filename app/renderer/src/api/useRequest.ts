import { useState, useEffect, useCallback } from 'react';
import useAxios, { configure } from 'axios-hooks';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { Notification } from '@arco-design/web-react';
import axios from './baseAxios';
export interface UseApiOptions {
  auto?: boolean;
  ready?: boolean;
  dependencies?: any[];
  onError?: (error: AxiosError) => void;
}
configure({ axios });
export const useRequest = <TResponse = any>(
  requestConfig: AxiosRequestConfig,
  { auto = false, ready = false, dependencies = [], onError }: UseApiOptions = {}
) => {
  const [trigger, setTrigger] = useState(auto);

  const [{ data, loading, error }, execute] = useAxios<TResponse>(requestConfig, { manual: true });

  const run = useCallback(
    (runOptions?: AxiosRequestConfig) => {
      return execute(runOptions || requestConfig)
        .then(response => response.data)
        .catch((error: AxiosError) => {
          if (onError) {
            onError(error);
          }
          Notification.error({ title: '请求异常', content: error?.message });
          console.error(error);
        });
    },
    [execute, requestConfig]
  );

  useEffect(() => {
    if (trigger && ready) {
      run().catch(error => {
        if (onError) {
          onError(error);
        }
        Notification.error({ title: '请求异常', content: error?.message });
        console.error(error);
      });
      setTrigger(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, ready, run, ...dependencies]);

  return { data, loading, error, run };
};
