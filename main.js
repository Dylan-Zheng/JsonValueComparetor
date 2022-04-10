const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');
const Store = require('electron-store');


const createElectronStoreHander = (name) => {
    const store = new Store({name});
    ipcMain.handle(`get${name}`, (event, key, defaultValue) => {
        return store.get(key, defaultValue);
    });
    ipcMain.handle(`set${name}`, (event, key, value) => {
        store.set(key, value);
    });
    ipcMain.handle(`delete${name}`, (event, key) => {
        store.delete(key);
    });
    ipcMain.handle(`has${name}`, (event, key) => {
        store.has(key);
    });
}

createElectronStoreHander("Comparetor")

createElectronStoreHander("JsonItem")

createElectronStoreHander("RequestItem")



let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })
    const urlLocation = 'http://localhost:4000'
    mainWindow.loadURL(urlLocation)
    mainWindow.webContents.openDevTools()
})

