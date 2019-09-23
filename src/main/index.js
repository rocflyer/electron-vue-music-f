import { app, BrowserWindow, ipcMain } from 'electron'
// import Audio from 'audio'

import store from '../renderer/store'
const openDirectory = require('./open-directory');
// import Player from '../renderer/plugins/Player'
// const jsmediatags = require('jsmediatags');

// var audio = new Audio();
// let player = new Player();
// document.createElement('audio')

const { dialog } = require('electron');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        frame: false,
        transparent: true,
        webPreferences: { webSecurity: false },
        useContentSize: true,
        width: 800,
        height: 680,
        minWidth: 800,
        minHeight: 600,
        // backgroundColor:''
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    //实测可用 使用ipcRenderer接收即可
    mainWindow.on('resize', (event) => {
        // //可行但是不使用此方法了
        event.sender.send('music-win-size-change', mainWindow.getSize());
        // store.dispatch("setWinSize", mainWindow.getSize()); //在js中存储音乐文件
    })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('close', e => mainWindow.close()); //手动关闭程序
ipcMain.on('min', e => mainWindow.minimize()); //手动最小化程序
ipcMain.on('max', e => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
    } else {
        mainWindow.maximize()
    }
}); //手动最大化

ipcMain.on('play-music-to-main', event => event.sender.send('play-music-to-player')); //播放音乐

//仅仅改变存储路径，不改变存储文件
ipcMain.on('open-file-dialog', event => {
    dialog
        .showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        }, function(filePaths) {
            const files = filePaths;
            if (files !== undefined && files.length > 0) {
                store.dispatch("addLocalPath", files[0]); //在js中存储音乐路径

            }

        })
}); //打开文件目录

//当路径改变时会引用此函数
ipcMain.on('read-all-file', event => {

    const allLocalPath = store.getters.localPath;
    var allMusicFiles = []
    if (allLocalPath.length > 0) {

        for (var i = 0; i < allLocalPath.length; i++) {
            allMusicFiles = allMusicFiles.concat(openDirectory(allLocalPath[i], event))
        }
        store.dispatch("setMusicFiles", allMusicFiles); //在js中存储音乐文件
        // event.sender.send('music-files', allMusicFiles);
    } else {
        store.dispatch("setMusicFiles", []); //在js中存储音乐文件
    }

}); //读取全部文件

//   //播放音乐
//   ipcMain.on('play-music', (event,arg) => {

//     // var audio = new audio();

//     // audio.src = arg;
//     // audio.play();
//     // player._audioPlayer.src = arg
//     // player._audioPlayer.play()

// });//

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */