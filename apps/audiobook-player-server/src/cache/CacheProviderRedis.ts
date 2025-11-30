import {ICacheProvider} from "./Types";
import Redis from "ioredis";

const redis = new Redis({
    host: process.env.CACHE_REDIS_HOST,
    port: Number(process.env.CACHE_REDIS_PORT),
    db: Number(process.env.CACHE_REDIS_DATABASE),
});

export class CacheProviderRedis implements ICacheProvider {
    async get(key: string) {
        return redis.get(key);
    }

    async set(key: string, value: string) {
        await redis.set(key, value);
    }

    async invalidate() {
        return new Promise<void>((resolve, reject) => {
            redis.flushdb((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

export const cacheProvider: ICacheProvider = new CacheProviderRedis();
