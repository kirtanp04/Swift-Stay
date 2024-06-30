import NodeCache from 'node-cache';
import { Crypt } from './Crypt';
import { ProjectResponse, errorPath } from './Response';

export class Cache {
    private static _stdTTl: number = 1200;

    private static _myCache = new NodeCache({
        stdTTL: this._stdTTl, // remain for 20 min in cache
        checkperiod: 180, // 3min checking period of cache
    });

    static SetCache = (cacheKey: string, data: any, stdTTL?: number): ProjectResponse => {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const objEncrypt = Crypt.Encryption(data);
            if (objEncrypt.error === '') {
                const isSet = this._myCache.set(cacheKey, objEncrypt.data, stdTTL !== undefined ? stdTTL : this._stdTTl);

                if (isSet) {
                    _res.data = 'Cache Set Success: key ' + cacheKey;
                } else {
                    _res.error = errorPath('common/Cache', 'SetCache', 24) + ` Fail to cache data for key : ${cacheKey} `;
                }
            } else {
                _res.error = errorPath('common/Cache', 'SetCache', 27) + objEncrypt.error;
            }
        } catch (error) {
            _res.error = errorPath('common/Cache', 'SetCache', 30) + error;
        } finally {
            return _res;
        }
    };

    static ClearCache = (cacheKey: string): ProjectResponse => {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const isCachePresent = this._myCache.has(cacheKey);

            if (isCachePresent) {
                const isCleared = this._myCache.del(cacheKey);

                if (isCleared) {
                    _res.data = 'Success: Cache Cleared for key ' + cacheKey;
                } else {
                    _res.error = errorPath('common/Cache', 'ClearCache', 48) + ` Fail to clear cache for key : ${cacheKey} `;
                }
            } else {
                _res.error = errorPath('common/Cache', 'ClearCache', 51) + 'Wrong Cache Key: no Cache present.';
            }
        } catch (error) {
            _res.error = errorPath('common/Cache', 'ClearCache', 54) + error;
        } finally {
            return _res;
        }
    };

    static getCacheData = (cacheKey: string): ProjectResponse => {
        let _res: ProjectResponse = new ProjectResponse();

        try {
            const isCachePresent = this._myCache.has(cacheKey);

            if (isCachePresent) {
                const cachedData = this._myCache.get(cacheKey);

                if (cachedData) {
                    const objDecrypt = Crypt.Decryption(cachedData as string);
                    if (objDecrypt.error === '') {
                        _res.data = objDecrypt.data;
                    } else {
                        _res.error = errorPath('common/Cache', 'getCacheData', 75) + objDecrypt.error;
                    }
                } else {
                    _res.error = errorPath('common/Cache', 'getCacheData', 78) + 'Error retrieving cached data.';
                }
            } else {
                _res.error = errorPath('common/Cache', 'getCacheData', 81) + 'Wrong Cache Key: no Cache present.';
            }
        } catch (error) {
            _res.error = errorPath('common/Cache', 'getCacheData', 84) + error;
        } finally {
            return _res;
        }
    };
}
