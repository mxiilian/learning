const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  apiUrl: process.env.KOREAN_API_URL || 'http://localhost:3000',
})
