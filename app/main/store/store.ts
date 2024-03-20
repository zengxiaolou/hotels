import Store from 'electron-store';
import { StoreKey } from '@/types/enum';

class StoreManager {
  private static instance: StoreManager;
  private store: Store;

  private constructor() {
    this.store = new Store();
    this.initDefaults();
  }

  private initDefaults() {
    if (!this.store.get(StoreKey.LOGIN)) {
      this.store.set(StoreKey.LOGIN, true);
    }
    if (!this.store.get(StoreKey.WAIT_TIME)) {
      this.store.set(StoreKey.WAIT_TIME, 5);
    }
  }

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  public get(key: string): any {
    return this.store.get(key);
  }

  public set(key: string, value: any): void {
    this.store.set(key, value);
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public onDidChange(key: string, callback: (newValue: any, oldValue: any) => void): void {
    this.store.onDidChange(key, callback);
  }

  public deleteAll(): void {
    return this.store.clear();
  }
}

export default StoreManager;
