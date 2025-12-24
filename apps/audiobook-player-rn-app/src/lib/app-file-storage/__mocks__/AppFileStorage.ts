import {AppFileStorageFile, AppFileStorageFileType, IAppFileStorage} from "@/src/lib/app-file-storage";

export class AppFileStorage implements IAppFileStorage {

    async clear(): Promise<void> {
        throw new Error('Not implemented');
    }

    async copy(srcPath: string, destPath: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async directoryExists(path: string): Promise<boolean> {
        throw new Error('Not implemented');
    }

    async fileExists(path: string): Promise<boolean> {
        throw new Error('Not implemented');
    }

    async getFileReadableStream(path: string): Promise<ReadableStream> {
        throw new Error('Not implemented');
    }

    async getFileSize(path: string): Promise<number> {
        throw new Error('Not implemented');
    }

    async getFileUrl(path: string): Promise<string> {
        throw new Error('Not implemented');
    }

    async getFileWriteableStream(path: string): Promise<WritableStream> {
        throw new Error('Not implemented');
    }

    async init(): Promise<void> {

    }

    async list(path: string): Promise<AppFileStorageFile[]> {
        return []
    }

    async mkdir(path: string): Promise<AppFileStorageFile> {
        return {
            name: path,
            type: AppFileStorageFileType.Directory,
            path: path,
            url: `file://${path}`
        }
    }

    async move(srcPath: string, destPath: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async persist(): Promise<boolean> {
        return false
    }

    async readTextFile(path: string): Promise<string> {
        throw new Error('Not implemented');
    }

    async remove(path: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async touch(path: string): Promise<AppFileStorageFile> {
        throw new Error('Not implemented');
    }

    async writeTextFile(path: string, text: string): Promise<void> {
        throw new Error('Not implemented');
    }

}
