const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
//设定窗口大小
const { Winwidth, Winheight } = { Winwidth: 150, Winheight: 150 }

//初始化时钟
let tikID
const { workTime, breakTime } = require('./src/preload')
let mainContents = null
let currentTime = workTime
let sts = 'work';

const secondToMMSS = (t) => {
  let minute = parseInt(t / 60);
  let second = parseInt(t % 60);
  let MMSS = minute.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
  return MMSS;
}

let script = 'document.querySelector("#timeNum").innerHTML ="' + secondToMMSS(currentTime) + '";'
const tiktok = () => {
  currentTime -= 1
  script = 'document.querySelector("#timeNum").innerHTML ="' + secondToMMSS(currentTime) + '";'
  mainContents.executeJavaScript(script).then((result) => {
    console.log(result)
  })
  let alarm = ''
  if (currentTime == 0) {
    switch (sts) {
      case 'work':
        alarm = 'document.querySelector("#alarm").setAttribute("src", "2.mp3");'
        currentTime = breakTime + 1;
        sts = 'break';
        break;
      case 'break':
        alarm = 'document.querySelector("#alarm").setAttribute("src", "1.mp3");'
        currentTime = workTime + 1;
        sts = 'work';
        break;
      default:
    }
    mainContents.executeJavaScript(alarm + 'document.querySelector("#alarm").play();');
  }


}


//单一进程锁
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

//安装时退出
if (require('electron-squirrel-startup')) return app.quit();

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
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/clock.html'));
  mainContents = mainWindow.webContents

  // 打开开发者工具
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow).then(() => {
  mainContents.executeJavaScript(script).then((result) => {
    console.log(result)
  })
  globalShortcut.register('Super+Esc', () => {
    app.quit();
  });
  globalShortcut.register('Super+F2', () => {
    tikID = setInterval(() => {
      tiktok();
    }, 1000);
  });
  globalShortcut.register('Super+F3', () => {
    clearInterval(tikID);
    mainContents.executeJavaScript('document.querySelector("#pause").play();')
  })
})


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

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
