const { app, BrowserWindow, shell, protocol, net } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')

const distPath = app.isPackaged
  ? path.join(process.resourcesPath, 'dist')
  : path.join(__dirname, '../dist')

// API-URL für den Preload-Prozess setzen (wird über contextBridge an den Renderer übergeben)
process.env.KOREAN_API_URL = 'https://learning-production.up.railway.app'

// Eigenes Protokoll registrieren damit absolute Pfade (/assets, /_expo) korrekt auflösen
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } },
])

function createWindow() {
  const win = new BrowserWindow({
    width: 430,
    height: 932,
    minWidth: 375,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Korean Learning',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#090910',
    icon: path.join(__dirname, '../assets/images/icon.png'),
  })

  win.loadURL('app://localhost/')

  // Inputs in Electron brauchen explizit no-drag + user-select,
  // sonst behandelt das hiddenInset-Titelbar Mausklicks als Drag-Versuch
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      body { -webkit-app-region: no-drag; }

      /* 28px Platz für Traffic-Lights + Drag-Streifen */
      #root { padding-top: 28px; }

      body::before {
        content: '';
        display: block;
        position: fixed;
        top: 0;
        left: 80px;
        right: 0;
        height: 28px;
        -webkit-app-region: drag;
        z-index: 99999;
      }

      input, textarea, [contenteditable] {
        -webkit-app-region: no-drag !important;
        -webkit-user-select: text !important;
        user-select: text !important;
        cursor: text !important;
      }
    `)
  })

  // Externe Links im System-Browser öffnen
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url)
    // index.html für unbekannte Routen (SPA-Fallback)
    const file = pathname === '/' ? 'index.html' : pathname.slice(1)
    const filePath = path.join(distPath, file)
    return net.fetch(pathToFileURL(filePath).toString()).catch(() =>
      net.fetch(pathToFileURL(path.join(distPath, 'index.html')).toString())
    )
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
