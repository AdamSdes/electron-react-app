import { BrowserWindow, shell, app, protocol, net } from 'electron'
import { join } from 'path'
import { registerWindowIPC } from '@/lib/window/ipcEvents'
import appIcon from '@/resources/build/icon.png?asset'
import { pathToFileURL } from 'url'

export function createAppWindow(): void {
  // Register custom protocol for resources
  registerResourcesProtocol()

  // Create the main window.
  const mainWindow = new BrowserWindow({
    width: 998,
    height: 622,
    show: false,
    backgroundColor: '#060606',
    icon: appIcon,
    frame: false,
    autoHideMenuBar: false,
    title: 'Electron React App',
    maximizable: false,
    resizable: false,
    roundedCorners: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      devTools: true, // Enable developer tools
      webSecurity: false, // Disable web security for CORS issues during development
      allowRunningInsecureContent: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Handle certificate errors for API requests
  mainWindow.webContents.session.setCertificateVerifyProc((request, callback) => {
    // Allow the specific API domain to bypass certificate verification
    if (request.hostname === '195.200.30.205') {
      callback(0) // 0 means success
    } else {
      callback(-2) // Use default verification for other domains
    }
  })

  // Register IPC events for the main window.
  registerWindowIPC(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Auto-open DevTools in development
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools()
      console.log('🔧 Developer tools opened automatically')
    }
  })

  // Add keyboard shortcut for DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      mainWindow.webContents.toggleDevTools()
      console.log('🔧 Developer tools toggled via keyboard shortcut')
    }
  })

  // Log console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer Console ${level}]:`, message)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Register custom protocol for assets
function registerResourcesProtocol() {
  protocol.handle('res', async (request) => {
    try {
      const url = new URL(request.url)
      // Combine hostname and pathname to get the full path
      const fullPath = join(url.hostname, url.pathname.slice(1))
      const filePath = join(__dirname, '../../resources', fullPath)
      return net.fetch(pathToFileURL(filePath).toString())
    } catch (error) {
      console.error('Protocol error:', error)
      return new Response('Resource not found', { status: 404 })
    }
  })
}