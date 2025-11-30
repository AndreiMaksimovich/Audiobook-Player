import {ICacheProvider} from "./Types";

export class CacheProviderDummy implements ICacheProvider {
    async get(key: string) {
        return null;
    }
    async set(key: string, value: string) {}
    async invalidate() {}
}

export const cacheProvider: ICacheProvider = new CacheProviderDummy();
