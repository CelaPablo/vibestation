import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

import dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODELS = {
  'gpt-4': openai('gpt-4'),
  'gpt-4o': openai('gpt-4o'),
  'claude-3-opus': anthropic('claude-3-opus-20240229'),
  'claude-3-sonnet': anthropic('claude-3-sonnet-20240229'),
} as const;

type ModelKey = keyof typeof MODELS;

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  ipcMain.handle('generate-text', async (_event, { model, prompt }: { model: ModelKey, prompt: string }) => {
    const selectedModel = MODELS[model];
    try {
      const result = await generateText({ model: selectedModel, prompt });
      return { error: false, text: result.text }
    } catch (e) {
      return { error: true, text: e.toString() }
    }
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
