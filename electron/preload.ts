const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  chat: () => ipcRenderer.invoke("chat"),
});
