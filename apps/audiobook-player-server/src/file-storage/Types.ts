export interface IFileStorageService {
    fileIdToUrl: (fileId: string) => Promise<string>
}

export interface IFileStorageManager extends IFileStorageService {
    addFile: (path: string, fileIdPrefix: string | null) => Promise<string>
    removeFile: (fileId: string) => Promise<void>
    replace: (fileId: string, path: string) => Promise<void>
}


