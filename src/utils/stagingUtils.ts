import StorageNameEnum from '../enums/StorageNameEnum';

const storage = window.require('electron-json-storage');
const os = window.require('os');

export default {
    updateStaging: (storageKey: StorageNameEnum, value: object) => {
        storage.setDataPath(os.tmpdir());
        storage.set(storageKey, value);
    },

    clearStaging: (storageKey: StorageNameEnum) => {
        storage.setDataPath(os.tmpdir());
        storage.remove(storageKey);
    },

    retrieveStaging: (storageKey: StorageNameEnum): Promise<object> => {
        storage.setDataPath(os.tmpdir());
        return new Promise((resolve, reject) => {
            storage.get(storageKey, (error: any, data: object) => {
                if (error) reject(error);
                resolve(data);
            });
        });
    },
};
