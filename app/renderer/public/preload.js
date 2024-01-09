const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipc', {
});
