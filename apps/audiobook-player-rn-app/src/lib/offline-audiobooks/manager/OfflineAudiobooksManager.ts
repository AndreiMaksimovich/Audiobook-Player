import {
    DownloadTask,
    IOfflineAudiobooksManager,
    OfflineAudiobooksManagerListeners
} from "../Types";
import {Audiobook} from "shared"
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {
    downloadAudiobook as downloadAudiobookTask,
    getOfflineAudiobook,
    removeOfflineAudiobook,
    removeDownloadTask,
    removeAllOfflineAudiobooks,
    removeAllDownloadTasks,
    loadOfflineAudiobooks,
    loadDownloadTasks,
    initializeOfflineAudiobooksFileStorage,
    audiobookToOfflineAudiobook
} from "../Functions";

export class OfflineAudiobooksManager implements IOfflineAudiobooksManager {

    private downloadTaskAbortController: AbortController | null = null;
    private listeners?: OfflineAudiobooksManagerListeners;

    configure(listeners: OfflineAudiobooksManagerListeners): void {
        this.listeners = listeners;
    }

    async init(): Promise<void> {
        await initializeOfflineAudiobooksFileStorage()
    }

    async loadOfflineAudiobooks(): Promise<Audiobook[]> {
        return await loadOfflineAudiobooks()
    }

    async loadDownloadTasks(): Promise<DownloadTask[]> {
        return await loadDownloadTasks()
    }

    cancelDownload(): void {
        this.downloadTaskAbortController?.abort()
    }

    downloadAudiobook(audiobook: Audiobook): void {
        this._downloadAudiobook(audiobook).catch(console.error)
    }

    private async _downloadAudiobook(audiobook: Audiobook): Promise<void> {
        this.downloadTaskAbortController?.abort()
        const abortController = new AbortController()
        this.downloadTaskAbortController = abortController

        let lastProgressUpdateTime = DateTimeUtils.now()

        try {
            const offlineAudiobook = await downloadAudiobookTask(abortController.signal, audiobook, (progress) => {
                if (DateTimeUtils.now() - lastProgressUpdateTime > 250) {
                    this.listeners?.onDownloadTaskProgress(progress)
                    lastProgressUpdateTime = DateTimeUtils.now()
                }
            })

            if (offlineAudiobook) {
                this.listeners?.onDownloadTaskComplete(await audiobookToOfflineAudiobook(offlineAudiobook, false))
            } else {
                this.listeners?.onDownloadTaskCanceled(audiobook)
            }
        } catch (error) {
            if (!abortController.signal.aborted) {
                console.error(error)
                this.listeners?.onDownloadTaskFailed(error)
            }
        }
    }

    async removeOfflineAudiobook(audiobookId: number): Promise<void> {
        return await removeOfflineAudiobook(audiobookId)
    }

    async removeDownloadTask(audiobookId: number): Promise<void> {
        return await removeDownloadTask(audiobookId)
    }

    async removeAllOfflineAudiobooks(): Promise<void> {
        await removeAllOfflineAudiobooks()
    }

    async removeAllDownloadTasks(): Promise<void> {
        return await removeAllDownloadTasks()
    }

    async getOfflineAudiobook(audiobookId: number): Promise<Audiobook> {
        return await getOfflineAudiobook(audiobookId)
    }
}
