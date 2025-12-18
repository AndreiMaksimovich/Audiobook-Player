import {
    DownloadTask,
    IOfflineAudiobooksManager,
    OfflineAudiobooksManagerListeners,
    WorkerMessageType, WorkerState
} from "../Types";
import {Audiobook} from "../../../../../packages/shared"
import {
    getOfflineAudiobook,
    removeOfflineAudiobook,
    removeDownloadTask,
    removeAllOfflineAudiobooks,
    removeAllDownloadTasks,
    loadOfflineAudiobooks,
    loadDownloadTasks,
    initializeOfflineAudiobooksFileStorage,
    audiobookToOfflineAudiobook
} from "@/src/offline-audiobooks/Functions";
import {Message, serviceWorkerMessageBus} from "@/src/service-worker";

export class ServiceWorkerOfflineAudiobookManagerClient implements IOfflineAudiobooksManager {
    private listeners?: OfflineAudiobooksManagerListeners;

    configure(listeners: OfflineAudiobooksManagerListeners): void {
        this.listeners = listeners;
    }

    async init(): Promise<void> {
        await initializeOfflineAudiobooksFileStorage()

        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Worker_DownloadComplete,
            (message: Message<Audiobook>) => {
                audiobookToOfflineAudiobook(message.payload!, false)
                    .then((audiobook) => this.listeners?.onDownloadTaskComplete(audiobook))
                    .catch(console.error);
            }
        )

        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Worker_DownloadFailed,
            (message: Message<any>) => {
                this.listeners?.onDownloadTaskFailed(message.payload)
            }
        )

        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Worker_DownloadProgress,
            (message: Message<number>) => {
                this.listeners?.onDownloadTaskProgress(message.payload!)
            }
        )

        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Worker_State,
            (message: Message<WorkerState>) => {
                this.handleWorkerState(message.payload!)
            }
        )
    }

    cancelDownload(): void {
        serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Client_CancelDownload)
    }

    downloadAudiobook(audiobook: Audiobook) {
        serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Client_Download, audiobook)
    }

    private handleWorkerState(state: WorkerState) {
        this.listeners?.onWorkerStateChanged(state)
    }

    async loadOfflineAudiobooks(): Promise<Audiobook[]> {
        return await loadOfflineAudiobooks()
    }

    async loadDownloadTasks(): Promise<DownloadTask[]> {
        return await loadDownloadTasks()
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
