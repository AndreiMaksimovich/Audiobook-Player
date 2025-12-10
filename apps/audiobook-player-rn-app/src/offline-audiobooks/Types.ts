import {Audiobook} from "shared"
import {IAppFileStorage} from "@/src/app-file-storage";

export enum EventType {
    DownloadTaskComplete = "DownloadTaskComplete",
    DownloadTaskFailed = "DownloadTaskFailed",
    DownloadTaskProgress = "DownloadTaskProgress",
    DownloadTaskCanceled = "DownloadTaskCanceled",
}

export interface Event<T> {
    payload?: T
}

export interface DownloadTask {
    audiobook: Audiobook
    progress?: number
    isActive?: boolean
    error?: any
}

export interface OfflineAudiobooksManagerConfiguration {
    fileStorage: IAppFileStorage,
    audiobooksDir: string,
    downloadTasksDir: string,
}

export interface IOfflineAudiobooksManager {
    init(configuration: OfflineAudiobooksManagerConfiguration): Promise<void>

    addEventListener<T extends EventType>(type: T, listener: EventPayloadByEvent[T] extends never ? () => void : (event: EventPayloadByEvent[T]) => void): void
    removeEventListener<T extends EventType>(type: T, listener: EventPayloadByEvent[T] extends never ? () => void : (event: EventPayloadByEvent[T]) => void): void

    downloadAudiobook(audiobook: Audiobook): Promise<Audiobook | null>
    cancelDownload(): void

    removeOfflineAudiobook(audiobookId: number): Promise<void>
    removeDownloadTask(audiobookId: number): Promise<void>

    removeAllOfflineAudiobooks(): Promise<void>
    removeAllDownloadTasks(): Promise<void>

    loadOfflineAudiobooks(): Promise<Audiobook[]>
    loadDownloadTasks(): Promise<DownloadTask[]>

    getOfflineAudiobook(audiobookId: number): Promise<Audiobook>
}

export type EventPayloadByEvent = {
    [EventType.DownloadTaskComplete]: Event<Audiobook>;
    [EventType.DownloadTaskFailed]: Event<Error>;
    [EventType.DownloadTaskProgress]: Event<number>;
    [EventType.DownloadTaskCanceled]: Event<Audiobook>;
}

export class OfflineAudiobookNotFound extends Error {}
export class OfflineAudiobookIntegrityCheckFailed extends Error {
    error?: any;
    constructor(message?: string, error?: any) {
        super(message);
        this.error = error;
    }
}
