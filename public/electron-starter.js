require('dotenv').config()
const electron = require('electron')
const path = require('path')
const api = require('./api/api')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let searchTerm

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    cleanLocalStorage()
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (!!searchTerm) {
    api.search([searchTerm], (feed, searchTerm) => {
      mainWindow.webContents.send('message', feed)
      mainWindow.webContents.send('twitter-account', searchTerm)
    })
  }
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    cleanLocalStorage()
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const cleanLocalStorage = () => {
  electron.session.defaultSession.clearStorageData({
    storages: ['localstorage'],
  })
}

electron.ipcMain.on('search', (event, arg) => {
  searchTerm = arg
  if (!!searchTerm && typeof arg === 'string') {
    api.search([searchTerm], ({ feed, searchTerm }) => {
      mainWindow.webContents.send('message', feed)
      mainWindow.webContents.send('twitter-account', searchTerm)
    })
  }
})
