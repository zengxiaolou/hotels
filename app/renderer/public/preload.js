const { contextBridge , ipcRenderer} = require('electron');

const ChannelsMap = {
  COLLECT_SWITCH: 'COLLECT_SWITCH',
  GET_STORY_BY_KEY: 'GET_STORY_BY_KEY',
  SET_STORY_BY_KEY: 'SET_STORY_BY_KEY',
}

contextBridge.exposeInMainWorld('ipc', {
  switch: async flag => ipcRenderer.invoke(ChannelsMap.COLLECT_SWITCH, flag),
  getStoryByKey: async key => ipcRenderer.invoke(ChannelsMap.GET_STORY_BY_KEY, key),
  setStoryByKey: async (key, value) => ipcRenderer.invoke(ChannelsMap.SET_STORY_BY_KEY, {key, value}),
});
