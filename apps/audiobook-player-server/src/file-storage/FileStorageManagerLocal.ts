import { FileStorageServiceLocal } from "./FileStorageServiceLocal";
import {IFileStorageManager} from "./Types";
import * as nodePath from "path"
import { v4 as uuid } from 'uuid';
import fs from "fs/promises"

export class FileStorageManagerLocal extends FileStorageServiceLocal implements IFileStorageManager {
    constructor(baseUrl: string, private basePath: string) {
        super(baseUrl);
    }

    private getPath = (fileId: string) => nodePath.join(this.basePath, fileId);

    async addFile(path: string, fileIdPrefix: string | null = null): Promise<string> {
        try {
            const fileExtension = nodePath.extname(path);
            const fileId = `${(fileIdPrefix ?? "")}${uuid()}${fileExtension}`;
            const targetPath = this.getPath(fileId)
            await fs.copyFile(path, targetPath);
            return Promise.resolve(fileId);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async removeFile(fileId: string): Promise<void> {
        return fs.unlink(this.getPath(fileId))
    }

    async replace(fileId: string, path: string): Promise<void> {
        const targetPath = this.getPath(fileId);
        return fs.copyFile(path, targetPath);
    }
}
