const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  runAppleScript: () => ipcRenderer.send('run-apple-script'),
});