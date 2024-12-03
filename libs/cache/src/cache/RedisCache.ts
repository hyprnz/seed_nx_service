import RedisClient, { Redis, RedisOptions } from 'ioredis';

export class RedisCache {
    private cache: Redis;
    private readonly logger: (message: string | object) => void;

    constructor(logger: any, options: RedisOptions) {
        this.cache = new RedisClient(options);
        this.logger = logger;
    }

    public async get(key: string, getDataFunction: any) {
        const t0: number = new Date().getTime();
        const value = await this.cache.get(key);
        if (value) {
            const t1: number = new Date().getTime();
            this.logger(`(using cache) Call to ${getDataFunction.name} took ${(t1 - t0) / 1000} seconds`);
            return JSON.parse(value);
        }

        const result: any = await getDataFunction();
        await this.cache.set(key, Buffer.from(JSON.stringify(result)));

        const t1: number = new Date().getTime();
        this.logger(`(not using cache) Call to ${getDataFunction.name} took ${(t1 - t0) / 1000} seconds`);
        return result;
    }

    public async del(keys: string | string[]): Promise<void> {
        if (Array.isArray(keys)) {
            await Promise.all(keys.map((key) => this.cache.del(key)));
            return;
        }
        await this.cache.del(keys);
    }

    public async delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }
        const keys: string[] = await this.cache.keys(startStr + '*');
        await this.del(keys);
    }

    public async flush(): Promise<any> {
        await this.cache.flushall();
    }

    public quit(): Promise<any> {
        return this.cache.quit();
    }
}
