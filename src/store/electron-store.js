const {ipcRenderer} = window.require("electron");

class ElectronStore {

    constructor(name) {
        this.name = name
    }

    store = async () => {
        return await ipcRenderer.invoke(`get${this.name}`, `root`, {});
    }

    get = async (key, defaultValue = null) => {
        return await ipcRenderer.invoke(`get${this.name}`, `root.${key}`);
    }

    set = async (key, value) => {
        await await ipcRenderer.invoke(`set${this.name}`, `root.${key}`, value);
    }

    delete = async (key) => {
        await ipcRenderer.invoke(`delete${this.name}`, `root.${key}`);
    }
    has = async (key) => {
        return await ipcRenderer.invoke(`has${this.name}`, `root.${key}`);
    }

}

export const ComparetorStorage = new ElectronStore("Comparetor");

export const JsonItemStorage = new ElectronStore("JsonItem")
