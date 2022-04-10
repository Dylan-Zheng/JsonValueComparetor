import { v4 as uuidv4 } from 'uuid';
import { ComparetorStorage, JsonItemStorage } from '../store/electron-store';


export const ComparetorStorageService = (() => {

    const getAll = async () => {
        return await ComparetorStorage.store();
    }

    const saveAndReturn = async (comparetor) => {
        const uuid = uuidv4();
        const forSave = {
            ...comparetor,
            uuid: uuid
        }
        await ComparetorStorage.set(uuid, forSave)
        return forSave
    }

    const updateAndReturn = async (comparetor) => {
        const forUpdate = {
            ...comparetor,
        }
        await ComparetorStorage.set(comparetor.uuid, forUpdate);
        return forUpdate;
    }

    const remove = async (comparetor) => {
        await JsonItemStorage.delete(comparetor.uuid)
        await ComparetorStorage.delete(comparetor.uuid);
    }

    const has = async (key) => {
        ComparetorStorage.has(key)
    }

    return {
        getAll,
        saveAndReturn,
        updateAndReturn,
        remove,
        has
    }

})()

export const JsonItemStorageService = (() => {

    const getAll = async () => {
        return await JsonItemStorage.store();
    }

    const saveAndReturn = async (cuuid, item) => {
        const uuid = uuidv4();
        const forSave = {
            ...item,
            uuid: uuid,
        }
        await JsonItemStorage.set(`${cuuid}.${uuid}`, forSave)
        return forSave;
    }

    const updateAndReturn = async (cuuid, item) => {
        const forUpdate = {...item}
        await JsonItemStorage.set(`${cuuid}.${item.uuid}`, forUpdate);
        return forUpdate;
    }

    const remove = async (cuuid, item) => {
        JsonItemStorage.delete(`${cuuid}.${item.uuid}`);
    }

    const removeAll = async (cuuid) => {
        JsonItemStorage.delete(`${cuuid}`);
    }

    const has = async (cuuid, iuuid) => {
        JsonItemStorage.has(`${cuuid}.${iuuid}`)
    }

    return {
        getAll,
        saveAndReturn,
        updateAndReturn,
        remove,
        removeAll,
        has
    }

})()




export default {
    ComparetorStorageService,
    JsonItemStorageService
};