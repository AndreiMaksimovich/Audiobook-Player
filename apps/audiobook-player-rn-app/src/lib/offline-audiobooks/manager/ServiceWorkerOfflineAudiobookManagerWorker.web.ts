import {Message, serviceWorkerMessageBus} from "@/src/lib/service-worker";
import {WorkerMessageType, WorkerState} from "@/src/lib/offline-audiobooks/Types";
import {Audiobook} from 'shared'
import {downloadAudiobook, initializeOfflineAudiobooksFileStorage} from "@/src/lib/offline-audiobooks/Functions";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";

export class ServiceWorkerOfflineAudiobookManagerWorker {
    private abortController: AbortController | null = null;

    private state: WorkerState = {
        progress: 0,
        isActive: false,
        currentlyDownloading: null
    }

    async init(): Promise<void> {
        await initializeOfflineAudiobooksFileStorage()

        // Cancel
        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Client_CancelDownload,
            (message: Message<any>) => {
                this.abortController?.abort()
                this.state = {
                    progress: 0,
                    isActive: false,
                    currentlyDownloading: null
                }
            }
        )

        // Download
        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Client_Download,
            (message: Message<Audiobook>) => {
                this.download(message.payload!).catch(console.error)
            }
        )

        // State
        serviceWorkerMessageBus.addMessageListener(
            WorkerMessageType.DownloadTasks_Client_GetState,
            (message: Message<Audiobook>) => {
                serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Worker_State, this.state)
            }
        )
    }

    private async download(audiobook: Audiobook): Promise<void> {
        this.abortController?.abort()
        const abortController = new AbortController()
        this.abortController = abortController

        this.state = {
            progress: 0,
            isActive: true,
            currentlyDownloading: audiobook
        }

        let lastProgressUpdateTime = DateTimeUtils.now()

        try {

            const offlineAudiobook = await downloadAudiobook(abortController.signal, audiobook, (progress: number) => {
                this.state.progress = progress
                if (DateTimeUtils.now() - lastProgressUpdateTime > 250) {
                    lastProgressUpdateTime = DateTimeUtils.now()
                    serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Worker_DownloadProgress, progress)
                }
            })

            if (offlineAudiobook) {
                serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Worker_DownloadComplete, offlineAudiobook)
            }

        } catch (error) {
            if (!abortController.signal.aborted) {
                console.error(error)
                serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Worker_DownloadFailed, error)
            }
        }

        this.state = {
            progress: 0,
            isActive: false,
            currentlyDownloading: null
        }
    }
}
