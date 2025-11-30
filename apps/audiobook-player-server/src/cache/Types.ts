export interface ICacheProvider {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    invalidate: () => Promise<void>;
}
