import dotenv from 'dotenv';
dotenv.config();

import {FileStorageServiceLocal} from "./file-storage/FileStorageServiceLocal";
import {AudiobookProvider} from "./audiobooks/AudiobookProvider";
import {mysqlPool} from "./mysql/MySqlConnection";
import {AudiobookManager} from "./audiobooks/AudiobookManager";
import {FileStorageManagerLocal} from "./file-storage/FileStorageManagerLocal";
import {IFileStorageManager, IFileStorageService} from "./file-storage/Types";
import {IAudiobookProvider} from "./audiobooks/Types.API";

// Provider
export const fileStorageService: IFileStorageService
    = new FileStorageServiceLocal(process.env.FILE_STORAGE_BASE_URL!);
export const audiobookProvider: IAudiobookProvider
    = new AudiobookProvider(mysqlPool, fileStorageService);

// Manager
export const fileStorageManager: IFileStorageManager
    = new FileStorageManagerLocal(process.env.FILE_STORAGE_BASE_URL!, process.env.FILE_STORAGE_LOCAL_PATH!);
export const audiobookManager = new AudiobookManager(mysqlPool, fileStorageManager)
