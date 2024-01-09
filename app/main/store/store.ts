import Store from 'electron-store';

class StoreManager {
  private static instance: StoreManager;
  private store: Store;

  private constructor() {
    this.store = new Store();
    this.initDefaults();
  }

  private initDefaults() {
    this.store.set('start', false);
    this.store.set('currentType', 'today');
    if (!this.store.get('url')) {
      this.store.set('url', '/act/credit/wreport/getupdata.action');
    }
    if (!this.store.get('website')) {
      this.store.set('website', 'https://www.yaxin222.net');
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
