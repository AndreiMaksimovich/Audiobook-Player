import {Audiobook} from "shared"

export interface OfflineAudiobooksManagerListeners {
    onDownloadTaskComplete: (audiobook: Audiobook) => void;
    onDownloadTaskFailed: (error: any) => void;
    onDownloadTaskProgress: (progress: number) => void;
    onDownloadTaskCanceled: (audiobook?: Audiobook) => void;
    onWorkerStateChanged: (workerState: WorkerState) => void;
}

export interface DownloadTask {
    audiobook: Audiobook
    progress?: number
    isActive?: boolean
    error?: any
}

export interface IOfflineAudiobooksManager {

    init(): Promise<void>
    configure(listeners: OfflineAudiobooksManagerListeners): void

    downloadAudiobook(audiobook: Audiobook): void
    cancelDownload(): void

    removeDownloadTask(audiobookId: number): Promise<void>
    removeAllDownloadTasks(): Promise<void>

    removeAllOfflineAudiobooks(): Promise<void>
    removeOfflineAudiobook(audiobookId: number): Promise<void>

    loadOfflineAudiobooks(): Promise<Audiobook[]>
    loadDownloadTasks(): Promise<DownloadTask[]>

    getOfflineAudiobook(audiobookId: number): Promise<Audiobook>
}

export class OfflineAudiobookNotFound extends Error {}

export class OfflineAudiobookIntegrityCheckFailed extends Error {
    error?: any;
    constructor(message?: string, error?: any) {
        super(message);
        this.error = error;
    }
}

export interface WorkerState {
    currentlyDownloading: Audiobook | null,
    progress: number,
    isActive: boolean,
}

export enum WorkerMessageType {
    DownloadTasks_Client_Download = "DownloadTasks_Client_Download",
    DownloadTasks_Client_CancelDownload = "DownloadTasks_Client_CancelDownload",
    DownloadTasks_Client_GetState = "DownloadTasks_Client_GetState",

    DownloadTasks_Worker_State = "DownloadTasks_Worker_State",
    DownloadTasks_Worker_DownloadProgress = "DownloadTasks_Worker_DownloadProgress",
    DownloadTasks_Worker_DownloadComplete = "DownloadTasks_Worker_DownloadComplete",
    DownloadTasks_Worker_DownloadFailed = "DownloadTasks_Worker_DownloadFailed",
}
