const electron = require('electron');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = electron;
const isDev = require('electron-is-dev');
const { Menu, globalShortcut } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL('http://localhost:3000' || url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.on('closed', () => mainWindow = null);
  globalShortcut.register('CmdOrCtrl+Q', () => app.quit());

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

ipcMain.on('userLogin', (e, user) => {
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('userLoginSuccess', user);
  })  
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const menuTemplate = [
  {
    label: 'Chat',
    submenu: [
      {
        label: 'Quit', 
        click() {
          app.quit();
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'reload'
      }
    ]
  }
]

if(isDev) {
  menuTemplate.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'DevTools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}

if(process.platform == 'darwin') {
  menuTemplate.unshift();
}