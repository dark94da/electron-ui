import { useEffect } from 'react';
import stagingUtils from '../utils/stagingUtils';
import StorageNameEnum from '../enums/StorageNameEnum';
import { ResItem } from '../utils/exportResult';

export default function (
    storageKey: StorageNameEnum,
    setState: (f: (prev: object) => object) => void
) {
    useEffect(() => {
        stagingUtils
            .retrieveStaging(storageKey)
            .then((res) => {
                if (!res) throw new Error();
                if (Object.prototype.toString.call(res) !== '[object Array]') throw new Error();
                setState((prev) => ({
                    ...prev,
                    stagingResult: res as Array<ResItem>,
                }));
            })
            .catch(() => {});
    }, []);
}
