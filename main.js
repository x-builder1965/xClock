// main.js -------------------------------------------------------------
const copyright = 'Copyright © 2025-2026 @x-builder, Japan';
const email = 'x-builder@gmail.com';
const appName = 'xClock -デジタル時計- Ver1.28.0';
// ---------------------------------------------------------------------
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        icon: path.join(__dirname, 'xClock.ico'),
        autoHideMenuBar: true, // Altキーでメニューバーを表示/非表示
        menuBarVisible: false // 初期状態で非表示
    });

    win.loadFile('index.html');
    win.maximize();
}

// フォルダ選択ダイアログ
ipcMain.handle('open-folder-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
        const fs = require('fs').promises;
        const folderPath = result.filePaths[0];
        const files = await fs.readdir(folderPath);
        const videoFiles = files
            .filter(file => /\.(mp4|mkv|webm)$/i.test(file))
            .map(file => ({
                name: file,
                path: path.join(folderPath, file)
            }));
        return videoFiles;
    }
    return [];
});

// ファイル選択ダイアログ
ipcMain.handle('open-video-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Videos', extensions: ['mp4', 'mkv', 'webm'] }
        ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return [{ name: path.basename(result.filePaths[0]), path: result.filePaths[0] }];
    }
    return [];
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});