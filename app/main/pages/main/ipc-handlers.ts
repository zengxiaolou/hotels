import { ipcMain } from 'electron';
import { Channels } from './channels';
import {  store } from '@/components/singletons';
import { StoreKey } from '@/types/enum';
import createSpider from '@/pages/spider';
import createCronjob from '@/pages/cronjob';

export const registerIpcHandler = () => {
  ipcMain.handle(Channels.COLLECT_SWITCH, (event: any, argument: string) => {
      store.set(StoreKey.SWITCH, argument);
      if (argument === 'start' && store.get(StoreKey.LOGIN) ===true) {
         createSpider()
      }
      return true;
  })

  ipcMain.handle(Channels.GET_STORY_BY_KEY, async (event: any, argument: StoreKey)  => {
    return store.get(argument);
  })

  ipcMain.handle(Channels.SET_STORY_BY_KEY, (event: any, argument) => {
    store.set(argument.key, argument.value);
    if (argument.key === StoreKey.CRONJOB && argument.value === "start") {
      createCronjob()
    }
    return true
  })
}

