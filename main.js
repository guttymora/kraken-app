// With ❤ by GuttyMora
const {app, BrowserWindow, ipcMain} = require('electron');
const WorkerHandler = require('./src/processors/worker.handler');

// Work threads handler
const workerHandler = WorkerHandler.getInstance();
workerHandler.loadWorkers();

const createWindow = () => {
    const appWin = new BrowserWindow({
        width: 1000,
        height: 600,
        title: 'Kraken Encrypt',
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            //devTools: false
        }
    });

    appWin.loadURL(`file://${__dirname}/build/index.html`);
    appWin.setMenu(null);
    appWin.webContents.openDevTools();

    appWin.on('closed', appWin.destroy);
};

const closeApp = () => {
    if (process.platform !== 'darwin') {
        //workerHandler.closeWorkers();
        app.quit();
    }
};

// Registering Ipc events
ipcMain.on('closeApp', () => {
    workerHandler.closeWorkers();
    return closeApp();
});

ipcMain.handle('requestFiles', (event, folder) => {
    return new Promise((resolve, reject) => {
        workerHandler
            .invokeWorker('FileProcessor', {method: 'getFiles', folder})
            .onSuccess((data) => {
                resolve(data);
            })
            .onFailure(err => {
                reject(err);
            })
    });
});

ipcMain.handle('encryptFile', async (event, file) => {
    return new Promise((resolve, reject) => {
        workerHandler
            .invokeWorker('FileProcessor', {method: 'encrypt', file})
            .onSuccess((data) => {
                resolve(data);
            })
            .onFailure(err => {
                reject(err);
            })
    });
});

ipcMain.handle('decryptFile', async (event, file) => {
    return new Promise((resolve, reject) => {
        workerHandler
            .invokeWorker('FileProcessor', {method: 'decrypt', file})
            .onSuccess((data) => {
                resolve(data);
            })
            .onFailure(err => {
                reject(err);
            })
    });
});

// App events
app.on('ready', createWindow);

app.on('before-quit', () => {
    console.log('before quit!!');
});

app.on('window-all-closed', () => {
    closeApp();
});
