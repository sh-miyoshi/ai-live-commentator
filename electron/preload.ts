const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  chat: (payload: {
    title: string
    context: string
  }) => ipcRenderer.invoke("chat", payload),
});
