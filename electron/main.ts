import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";

const DEV_URL = "http://localhost:5173";
const OLLAMA_CHAT_URL = "http://127.0.0.1:11434/api/chat";

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 720,
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (!app.isPackaged) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // ビルド時は dist/index.html を読む想定（必要なら後で整備）
    win.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Renderer -> Main: ストリーミングチャット
ipcMain.handle("ollama:chat", async (event, payload: {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}) => {
  const wc = event.sender;

  const res = await fetch(OLLAMA_CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: payload.model,
      messages: payload.messages,
      stream: true
    })
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama request failed: ${res.status} ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // OllamaはNDJSON（1行1JSON）で返ってくる
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);

      if (!line) continue;

      const json = JSON.parse(line);
      const chunk = json?.message?.content ?? "";
      const isDone = Boolean(json?.done);

      if (chunk) {
        full += chunk;
        wc.send("ollama:chunk", { chunk, full });
      }
      if (isDone) {
        wc.send("ollama:done", { full });
      }
    }
  }

  return { full };
});
