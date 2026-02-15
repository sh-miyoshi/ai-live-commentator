import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";

const DEV_URL = "http://localhost:5173";

function createWindow() {
  const win = new BrowserWindow({
    width: 990,
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

ipcMain.handle("chat", (_, payload:{title: string}) => {
  console.log("title: ", payload.title)

  return [
    { id: crypto.randomUUID(), user: 'Alice', message: 'Hello!' },
  ];
});
