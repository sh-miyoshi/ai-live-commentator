import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import ollama from 'ollama'
import { GoogleGenAI } from '@google/genai'

const DEV_URL = 'http://localhost:5173'

const OLLAMA_MODEL_NAME = 'qwen3:4b'

const GEMINI_API_KEY = '' // 設定されている場合geminiを使います
const GEMINI_MODEL_NAME = 'gemini-3-flash-preview'

function createWindow () {
  const win = new BrowserWindow({
    width: 990,
    height: 720,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist-electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (!app.isPackaged) {
    win.loadURL(DEV_URL)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    // ビルド時は dist/index.html を読む想定（必要なら後で整備）
    win.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle(
  'chat',
  async (_, payload: { title: string; context: string }) => {
    let model = 'ollama'
    if (GEMINI_API_KEY != '') {
      model = 'gemini'
    }
    console.log('title: ', payload.title)
    console.log('context: ', payload.context)

    let message = ''
    if (model === 'ollama') {
      // OLLAMA
      const response = await ollama.chat({
        model: OLLAMA_MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `あなたは「${payload.title}」という配信の視聴者です。`
          },
          {
            role: 'user',
            content: `配信主は最後に「${payload.context}」と言ってるのでその回答を考えてください。回答は1文で簡潔にしてください。なお、チャットメッセージの部分のみ出力してください。`
          }
        ]
      })
      console.log('ollama response: ', response.message)
      message = response.message.content
    } else if (model === 'gemini') {
      // Gemini
      const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY
      })

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: `あなたは「${payload.title}」という配信の視聴者です。配信主は最後に「${payload.context}」と言ってるのでその回答を考えてください。回答は1文で簡潔にしてください。なお、チャットメッセージの部分のみ出力してください。`
      })

      console.log('gemini response: ', response)
      message = response.text || ''
    }

    return [
      {
        id: crypto.randomUUID(),
        user: generatedName(),
        message: message
      }
    ]
  }
)

const generatedName = () => {
  const names = [
    'Sylwyn',
    'Kaeldor',
    'Zarmir',
    'Fenen',
    'Zarwyn',
    'Kaeldir',
    'Draen',
    'Fenwyn',
    'Nymlas',
    'Galmir',
    'Fenrian',
    'Aradir',
    'Zarath',
    'Kaelwen',
    'Raeiel',
    'Lyrlas',
    'Raeion',
    'Nymrian',
    'Thalen',
    'Morath',
    'Lyrath',
    'Raeiel',
    'Zarlas',
    'Eldath'
  ]

  return names[Math.floor(Math.random() * names.length)]
}
