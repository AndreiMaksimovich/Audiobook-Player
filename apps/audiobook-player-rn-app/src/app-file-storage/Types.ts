export enum AppFileStorageFileType {
    File = 'file',
    Directory = 'directory',
}

export interface AppFileStorageFile {
    type: AppFileStorageFileType;
    name: string;
    path: string;
    url?: string;
}

export interface IAppFileStorage {
    init(): Promise<void>;
    persist(): Promise<boolean>;
    mkdir(path: string): Promise<AppFileStorageFile>;
    touch(path: string): Promise<AppFileStorageFile>;
    remove(path: string): Promise<void>;
    list(path: string): Promise<AppFileStorageFile[]>;
    move(srcPath: string, destPath: string): Promise<void>;
    copy(srcPath: string, destPath: string): Promise<void>;
    fileExists(path: string): Promise<boolean>;
    directoryExists(path: string): Promise<boolean>;
    getFileUrl(path: string): Promise<string>;
    writeTextFile(path: string, text: string): Promise<void>;
    readTextFile(path: string): Promise<string>;
    getFileSize(path: string): Promise<number>;
    getFileWriteableStream(path: string): Promise<WritableStream>;
    getFileReadableStream(path: string): Promise<ReadableStream>;
    clear(): Promise<void>;
}

export class BaseError {
    message?: string;
    constructor(message?: string) {
        this.message = message;
    }
}

export class FileNotFoundError extends BaseError {}
export class FileAlreadyExistsError extends BaseError {}
export class DirectoryNotFoundError extends BaseError {}
export class DirectoryAlreadyExistsError extends BaseError {}
export class PathNotFoundError extends BaseError {}
