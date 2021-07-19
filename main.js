// With ❤ by GuttyMora
const {app, BrowserWindow, ipcMain} = require('electron');
const FileProcessor = require('./src/processors/file.processor');

const createWindow = () => {
    const appWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Kraken App',
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: false
        }
    });

    appWin.loadURL(`file://${__dirname}/build/index.html`);
    appWin.setMenu(null);
    //appWin.webContents.openDevTools();

    appWin.on('closed', appWin.destroy);
};

const closeApp = () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
};

// Registering Ipc events
ipcMain.on('closeApp', () => {
    return closeApp();
});

ipcMain.handle('requestFiles', async (event, folder) => {
    const fileProcessor = new FileProcessor();
    return await fileProcessor.getFiles(folder);
});

ipcMain.handle('requestFileStats', async (event, filePath) => {
    const fileProcessor = new FileProcessor();
    return await fileProcessor.getFileStats(filePath);
});

// App events
app.on('ready', createWindow);

app.on('before-quit', () => {
    console.log('before quit!!');
});

app.on('window-all-closed', () => {
    closeApp();
});
