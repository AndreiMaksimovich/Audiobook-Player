import {
    AppFileStorageFile,
    AppFileStorageFileType, DirectoryNotFoundError, FileNotFoundError,
    IAppFileStorage,
    PathNotFoundError
} from "@/src/app-file-storage/Types";
import {Directory, Paths, File} from 'expo-file-system';

export class AppFileStorage implements IAppFileStorage {

    private readonly rootDirectory: Directory

    constructor() {
        this.rootDirectory = Paths.document
    }

    async init(): Promise<void> {}

    async persist(): Promise<boolean> {
        return true
    }

    directoryToStorageFile(directory: Directory): AppFileStorageFile {
        return {
            name: directory.name,
            path: Paths.relative(this.rootDirectory, directory),
            type: AppFileStorageFileType.Directory
        }
    }

    fileToStorageFile(file: File): AppFileStorageFile {
        return {
            name: file.name,
            path: Paths.relative(this.rootDirectory, file),
            url: file.uri,
            type: AppFileStorageFileType.File
        }
    }

    async mkdir(path: string): Promise<AppFileStorageFile> {
        const directory = new Directory(Paths.join(this.rootDirectory, path))
        if (!directory.exists) {
            directory.create({idempotent: true, intermediates: true})
        }
        return this.directoryToStorageFile(directory)
    }

    async touch(path: string): Promise<AppFileStorageFile> {
        const fullPath = Paths.join(this.rootDirectory, path)
        const file = new File(fullPath)
        if (!file.exists) {
            file.create()
        }
        return this.fileToStorageFile(file)
    }

    async remove(path: string): Promise<void> {
        const fullPath = Paths.join(this.rootDirectory, path)

        // File
        const file = new File(fullPath)
        if (file.exists) {
            console.log(`Delete file: ${fullPath}`)
            file.delete()
            return
        }

        // Directory
        const directory = new Directory(fullPath)
        if (directory.exists) {
            console.log(`Delete directory: ${fullPath}`)
            directory.delete()
            return
        }

        throw new PathNotFoundError()
    }

    async list(path: string): Promise<AppFileStorageFile[]> {
        const result: AppFileStorageFile[] = []
        const fullPath = Paths.join(this.rootDirectory, path)
        const directory = new Directory(fullPath)

        if (!directory.exists) {
            throw new DirectoryNotFoundError()
        }

        for (const file of directory.list()) {
            // console.log('file', file)
            if (file instanceof Directory) {
                result.push(this.directoryToStorageFile(file))
            } else {
                result.push(this.fileToStorageFile(file))
            }
        }

        return result
    }

    async move(srcPath: string, destPath: string): Promise<void> {
        await this.copy(srcPath, destPath)
        await this.remove(srcPath)
    }

    async copy(srcPath: string, destPath: string): Promise<void> {
        const fullSrcPath = Paths.join(this.rootDirectory, srcPath)
        const fullDestPath = Paths.join(this.rootDirectory, destPath)

        const file = new File(fullSrcPath)
        if (file.exists) {
            file.copy(new File(fullDestPath))
            return
        }

        const directory = new Directory(fullSrcPath)
        if (directory.exists) {
            directory.copy(new Directory(fullDestPath))
            return
        }

        throw new PathNotFoundError()
    }

    async fileExists(path: string): Promise<boolean> {
        return (new File(Paths.join(this.rootDirectory, path))).exists
    }

    async directoryExists(path: string): Promise<boolean> {
        return (new Directory(Paths.join(this.rootDirectory, path))).exists
    }

    async getFileUrl(path: string): Promise<string> {
        return this.getFile(path, true).uri
    }

    async writeTextFile(path: string, text: string): Promise<void> {
        const file = this.getFile(path, false)
        if (!file.exists) file.create()
        file.write(text)
    }

    async readTextFile(path: string): Promise<string> {
        return await this.getFile(path, true).text()
    }

    private getFile(path: string, checkFileExistence: boolean = true): File {
        const fullPath = Paths.join(this.rootDirectory, path)
        const file = new File(fullPath)
        if (checkFileExistence && !file.exists) {
            throw new FileNotFoundError(`File ${path} not found`)
        }
        return file
    }

    private getDirectory(path: string, checkFileExistence: boolean = true): Directory {
        const fullPath = Paths.join(this.rootDirectory, path)
        const file = new Directory(fullPath)
        if (checkFileExistence && !file.exists) {
            throw new DirectoryNotFoundError(`Directory ${path} not found`)
        }
        return file
    }

    async getFileSize(path: string): Promise<number> {
        return this.getFile(path, true).size
    }

    async getFileWriteableStream(path: string): Promise<WritableStream> {
        const file = this.getFile(path, false)
        if (!file.exists) file.create()
        return file.writableStream()
    }

    async getFileReadableStream(path: string): Promise<ReadableStream> {
        return this.getFile(path, true).readableStream()
    }

    async clear(): Promise<void> {
        for (const file of this.rootDirectory.list()) {
            file.delete()
        }
    }
}
