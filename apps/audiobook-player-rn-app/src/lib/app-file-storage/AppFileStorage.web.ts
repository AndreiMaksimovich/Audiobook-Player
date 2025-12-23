import {
    AppFileStorageFileType,
    AppFileStorageFile,
    IAppFileStorage,
    FileNotFoundError
} from "@/src/lib/app-file-storage/Types";
import {PATH_SEPARATOR} from "@/src/constants";

export function pathName(path: string): string {
    return path.split(PATH_SEPARATOR).pop() ?? ""
}

export function pathJoin(...parts: string[]) {
    let joinedPath = parts.join(PATH_SEPARATOR);
    joinedPath = joinedPath.replace(new RegExp(PATH_SEPARATOR + '{2,}', 'g'), PATH_SEPARATOR);
    if (joinedPath.startsWith(PATH_SEPARATOR)) {
        joinedPath = joinedPath.substring(1)
    }
    if (joinedPath.endsWith(PATH_SEPARATOR)) {
        joinedPath = joinedPath.substring(0, joinedPath.length - 1)
    }
    return joinedPath;
}

export function pathParse(path: string): ParsedPath {
    const parts = path.split(PATH_SEPARATOR);
    const name = parts.length > 0 ? parts[parts.length - 1] : null
    const dir = parts.length > 1 ? path.substring(0, path.length - name!.length - 1) : null;
    return {
        name: name,
        dir: dir,
        path: pathJoin(path)
    }
}

interface ParsedPath {
    path: string;
    name: string | null;
    dir: string | null;
}

export class AppFileStorage implements IAppFileStorage {
    private rootDirectory: FileSystemDirectoryHandle | null = null;

    private async getDirectoryHandle(path: string, create: boolean = true): Promise<FileSystemDirectoryHandle> {
        path = path.trim()
        const pathParts = path.split(PATH_SEPARATOR)
        const isRoot = path === ""
        if (isRoot) return this.rootDirectory!
        let directory = this.rootDirectory!
        for (const pathPart of pathParts) {
            directory = await directory.getDirectoryHandle(pathPart, {create: create})
        }
        return directory!
    }

    async init() {
        this.rootDirectory = await navigator.storage.getDirectory()
    }

    async persist(): Promise<boolean> {
        return navigator.storage.persist && await navigator.storage.persist()
    }

    private async getFileHandle(path: string, create: boolean = false): Promise<FileSystemFileHandle> {
        const parsedPath = pathParse(path)
        const directory = await this.getDirectoryHandle(parsedPath.dir ?? "", create)
        return await directory.getFileHandle(parsedPath.name!, {create: create})
    }

    async copy(srcPath: string, destPath: string): Promise<void> {
        const isDirectory = await this.directoryExists(srcPath)
        if (!isDirectory && !await this.fileExists(srcPath)) {
            throw new FileNotFoundError(`File ${srcPath} does not exist`)
        }

        // File
        if (!isDirectory) {
            const srcFileHandle = await this.getFileHandle(srcPath, false)
            const dstFileHandle = await this.getFileHandle(destPath, true)
            const outputStream = await dstFileHandle.createWritable()
            await outputStream.truncate(0)
            const srcFile = await srcFileHandle.getFile()
            const inputStream = srcFile.stream()
            await inputStream.pipeTo(outputStream)
            return
        }

        // Directory
        if (isDirectory) {
            const srcDir = await this.getDirectoryHandle(srcPath)
            const destDir = await this.getDirectoryHandle(destPath, true)
            await this._copy(srcDir, destDir)
        }
    }

    private async _copy(srcDir: FileSystemDirectoryHandle, dstDir: FileSystemDirectoryHandle): Promise<void> {
        // @ts-ignore
        for await (const [name, handle] of srcDir.entries()) {
            // file - copy file
            if (handle.kind === 'file') {
                const dstFileHandle = await dstDir.getFileHandle(handle.name, {create: true})
                const outputStream = await dstFileHandle.createWritable()
                const inputStream = await (await handle.getFile()).stream()
                await inputStream.pipeTo(outputStream)
            }
            // directory - go deeper
            else {
                const directoryHandler = await dstDir.getDirectoryHandle(handle.name, {create: true})
                await this._copy(handle, directoryHandler)
            }
        }
    }

    async move(srcPath: string, destPath: string): Promise<void> {
        await this.copy(srcPath, destPath)
        await this.remove(srcPath)
    }

    async list(path: string): Promise<AppFileStorageFile[]> {
        const directory = await this.getDirectoryHandle(path)
        const result: AppFileStorageFile[] = []
        // @ts-ignore
        for await (const [key, value] of directory.entries()) {
            const isDirectory = value.kind === 'directory'
            result.push({
                type: isDirectory ? AppFileStorageFileType.Directory : AppFileStorageFileType.File,
                path: pathJoin(path, key),
                name: value.name,
                url: !isDirectory ? await this.getFileHandleUrl(value) : undefined
            })
        }
        return result
    }

    async mkdir(path: string): Promise<AppFileStorageFile> {
        await this.getDirectoryHandle(path, true)
        return {
            type: AppFileStorageFileType.Directory,
            name: pathName(path),
            path: path
        }
    }

    async remove(path: string): Promise<void> {
        const parsedPath = pathParse(path);
        const directory = await this.getDirectoryHandle(parsedPath.dir ?? "")
        await directory.removeEntry(parsedPath.name!, {recursive: true})
    }

    async touch(path: string): Promise<AppFileStorageFile> {
        const parsedPath = pathParse(path);
        const directory = await this.getDirectoryHandle(parsedPath.dir ?? "", true)
        const file = await directory.getFileHandle(parsedPath.name!, {create: true})
        return {
            name: file.name,
            path: path,
            type: AppFileStorageFileType.File,
            url: await this.getFileHandleUrl(file)
        }
    }

    async fileExists(path: string): Promise<boolean> {
        const parsedPath = pathParse(path);
        try {
            const directory = await this.getDirectoryHandle(parsedPath.dir ?? "", false)
            await directory.getFileHandle(parsedPath.name!)
            return true
        } catch (e) {
            return false
        }
    }

    async directoryExists(path: string): Promise<boolean> {
        const parsedPath = pathParse(path);
        try {
            const directory = await this.getDirectoryHandle(parsedPath.dir ?? "", false)
            await directory.getDirectoryHandle(parsedPath.name!)
            return true
        } catch (e) {
            return false
        }
    }

    private async getFileHandleUrl(fileHandler: FileSystemFileHandle): Promise<string> {
        return URL.createObjectURL(await fileHandler.getFile())
    }

    async getFileUrl(path: string): Promise<string> {
        const fileHandler = await this.getFileHandle(path)
        return await this.getFileHandleUrl(fileHandler)
    }

    async readTextFile(path: string): Promise<string> {
        const fileHandle = await this.getFileHandle(path)
        return (await fileHandle.getFile()).text()
    }

    async writeTextFile(path: string, text: string): Promise<void> {
        const fileHandle = await this.getFileHandle(path, true)
        const outputStream = await fileHandle.createWritable()
        await outputStream.truncate(0)
        await outputStream.write(text)
        await outputStream.close()
    }

    async getFileSize(path: string): Promise<number> {
        const fileHandle = await this.getFileHandle(path)
        return (await fileHandle.getFile()).size
    }

    async getFileWriteableStream(path: string): Promise<WritableStream> {
        const fileHandle = await this.getFileHandle(path, true)
        return await fileHandle.createWritable()
    }

    async getFileReadableStream(path: string): Promise<ReadableStream> {
        const fileHandle = await this.getFileHandle(path, false)
        const file = await fileHandle.getFile()
        return file.stream()
    }

    async clear(): Promise<void> {
        const files = await this.list("")
        for await (const file of files) {
            await this.rootDirectory!.removeEntry(file.name, {recursive: true})
        }
    }
}
