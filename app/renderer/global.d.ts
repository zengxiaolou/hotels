import { StoreKey } from '@/types/enum';

declare global {
  interface Window {
    ipc: {
      switch: (flag: string) => Promise<boolean>;
      getStoryByKey: (key: StoreKey) => Promise<unknown>;
      setStoryByKey: (key: StoreKey, value: unknown  ) => Promise<boolean>;
    };
  }
}

export {};
