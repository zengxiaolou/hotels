import path from 'node:path';
import { app, BrowserWindow, Tray } from 'electron';
import { MAIN_DIRECTORY } from '@/const';
import { Platform } from '@/types/enum';

export const createTray = async (window: BrowserWindow) => {
  const tray = new Tray(path.resolve(MAIN_DIRECTORY, '../../assets/tray16.png'));

  if (process.platform === Platform.MAC) {
    app.dock.setIcon(path.resolve(MAIN_DIRECTORY, '../../assets/icon.png'));
  }

  return tray;
};
