const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  chat: (payload: {
    title: string
  }) => ipcRenderer.invoke("chat", payload),
});
