import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("llm", {
  chat: (payload: {
    model: string;
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  }) => ipcRenderer.invoke("ollama:chat", payload),

  onChunk: (cb: (data: { chunk: string; full: string }) => void) => {
    const handler = (_: any, data: any) => cb(data);
    ipcRenderer.on("ollama:chunk", handler);
    return () => ipcRenderer.removeListener("ollama:chunk", handler);
  },

  onDone: (cb: (data: { full: string }) => void) => {
    const handler = (_: any, data: any) => cb(data);
    ipcRenderer.on("ollama:done", handler);
    return () => ipcRenderer.removeListener("ollama:done", handler);
  }
});
