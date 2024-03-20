import { app, BrowserWindow } from 'electron';
import dotenv from 'dotenv';
import { create } from '@/pages/main';
import { createTray } from '@/components/tray';

let mainWindow: BrowserWindow | null;

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    dotenv.config();
    mainWindow = create();
    await createTray(mainWindow);
    // await createSpider()
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => {
    console.error(error);
  });
