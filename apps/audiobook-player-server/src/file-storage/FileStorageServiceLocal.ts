import { IFileStorageService } from "./Types";

export class FileStorageServiceLocal implements IFileStorageService {

    /**
     * @param baseUrl - base URL for the file server (without a trailing slash)
     */
    constructor(private baseUrl: string) {}

    fileIdToUrl(fileId: string): Promise<string> {
        return Promise.resolve(`${this.baseUrl}/${fileId}`);
    }
}
