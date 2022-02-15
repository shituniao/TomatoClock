const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
//设定时钟大小
const { Winwidth, Winheight } = { Winwidth: 150, Winheight: 150 }
const gotTheLock = app.requestSingleInstanceLock()

//单一进程锁
if (!gotTheLock) {
  app.quit()
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  //获取屏幕尺寸以决定窗口贴靠位置
  const { screen } = require('electron')
  const mainScreen = screen.getPrimaryDisplay();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainScreen.workAreaSize.width - Winwidth - 140,
    y: 0,
    center: false,
    width: Winwidth,
    height: Winheight,
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    thickFrame: false,
    transparent: true,
    focusable: true
  });
  //mainWindow.on('ready-to-show', mainWindow.clock.clockReady());

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/clock.html'));

  // 打开开发者工具
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  globalShortcut.register('Alt+Control+Esc', () => {
    app.quit();
  })
}).then(createWindow)




// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
