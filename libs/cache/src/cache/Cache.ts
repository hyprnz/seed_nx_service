import * as CJSCache from 'node-cache';
const NodeCache = (CJSCache as any).default;

type Key = string | number;

export class Cache {
    private cache: CJSCache;

    constructor(ttlSeconds: number) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    public async get(key: Key, storeFunction: any) {
        const value = this.cache.get(key);
        if (value) {
            return value;
        }
        const result: any = await storeFunction();
        this.cache.set(key, result);
        return result;
    }

    public del(keys: Key | Key[]) {
        this.cache.del(keys);
    }

    public delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    public keys() {
        return this.cache.keys();
    }

    public flush() {
        this.cache.flushAll();
    }
}
