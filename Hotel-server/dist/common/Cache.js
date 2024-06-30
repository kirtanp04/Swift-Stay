"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const Crypt_1 = require("./Crypt");
const Response_1 = require("./Response");
class Cache {
}
exports.Cache = Cache;
_a = Cache;
Cache._stdTTl = 1200;
Cache._myCache = new node_cache_1.default({
    stdTTL: _a._stdTTl, // remain for 20 min in cache
    checkperiod: 180, // 3min checking period of cache
});
Cache.SetCache = (cacheKey, data, stdTTL) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const objEncrypt = Crypt_1.Crypt.Encryption(data);
        if (objEncrypt.error === '') {
            const isSet = _a._myCache.set(cacheKey, objEncrypt.data, stdTTL !== undefined ? stdTTL : _a._stdTTl);
            if (isSet) {
                _res.data = 'Cache Set Success: key ' + cacheKey;
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/Cache', 'SetCache', 24) + ` Fail to cache data for key : ${cacheKey} `;
            }
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/Cache', 'SetCache', 27) + objEncrypt.error;
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Cache', 'SetCache', 30) + error;
    }
    finally {
        return _res;
    }
};
Cache.ClearCache = (cacheKey) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const isCachePresent = _a._myCache.has(cacheKey);
        if (isCachePresent) {
            const isCleared = _a._myCache.del(cacheKey);
            if (isCleared) {
                _res.data = 'Success: Cache Cleared for key ' + cacheKey;
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/Cache', 'ClearCache', 48) + ` Fail to clear cache for key : ${cacheKey} `;
            }
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/Cache', 'ClearCache', 51) + 'Wrong Cache Key: no Cache present.';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Cache', 'ClearCache', 54) + error;
    }
    finally {
        return _res;
    }
};
Cache.getCacheData = (cacheKey) => {
    let _res = new Response_1.ProjectResponse();
    try {
        const isCachePresent = _a._myCache.has(cacheKey);
        if (isCachePresent) {
            const cachedData = _a._myCache.get(cacheKey);
            if (cachedData) {
                const objDecrypt = Crypt_1.Crypt.Decryption(cachedData);
                if (objDecrypt.error === '') {
                    _res.data = objDecrypt.data;
                }
                else {
                    _res.error = (0, Response_1.errorPath)('common/Cache', 'getCacheData', 75) + objDecrypt.error;
                }
            }
            else {
                _res.error = (0, Response_1.errorPath)('common/Cache', 'getCacheData', 78) + 'Error retrieving cached data.';
            }
        }
        else {
            _res.error = (0, Response_1.errorPath)('common/Cache', 'getCacheData', 81) + 'Wrong Cache Key: no Cache present.';
        }
    }
    catch (error) {
        _res.error = (0, Response_1.errorPath)('common/Cache', 'getCacheData', 84) + error;
    }
    finally {
        return _res;
    }
};
