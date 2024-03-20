import { BrowserWindow } from 'electron';
import {Browser} from 'puppeteer';

export default class StateManager {
  mainWindow: BrowserWindow | undefined = undefined;
  spiderWindow:  Browser | undefined = undefined
  constructor() {
    this.mainWindow = undefined;
    this.spiderWindow = undefined;
  }
  setMainWindow(window?: BrowserWindow) {
    this.mainWindow = window;
  }
  getMainWindow(): BrowserWindow | undefined {
    return this.mainWindow;
  }

  setSpiderWindow(window?: Browser) {
    this.spiderWindow = window;
  }

  getSpiderWindow(): Browser | undefined {
    return this.spiderWindow;
  }
}
