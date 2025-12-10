import {
    DownloadTask,
    Event,
    EventPayloadByEvent,
    EventType,
    IOfflineAudiobooksManager, OfflineAudiobookIntegrityCheckFailed, OfflineAudiobookNotFound,
    OfflineAudiobooksManagerConfiguration
} from "./Types";
import {Audiobook, MediaFile} from "shared"
import {appFileStorage, AppFileStorageFileType, IAppFileStorage} from "@/src/app-file-storage";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import { fetch } from 'expo/fetch';

export class OfflineAudiobooksManager implements IOfflineAudiobooksManager {
    private eventListeners: Map<EventType, any[]> = new Map();
    private fileStorage: IAppFileStorage | null = null;
    private offlineAudiobooksDir: string = ""
    private downloadTasksDir: string = ""
    private downloadTaskAbortController: AbortController | null = null;

    private getOfflineAudiobookDir(id: number): string {
        return `${this.offlineAudiobooksDir}/${id}`
    }

    private getDownloadTaskDir(id: number): string {
        return `${this.downloadTasksDir}/${id}`
    }

    async init(configuration: OfflineAudiobooksManagerConfiguration): Promise<void> {
        this.fileStorage = configuration.fileStorage
        this.offlineAudiobooksDir = configuration.audiobooksDir
        this.downloadTasksDir = configuration.downloadTasksDir

        // Make sure that the data directories exist
        await this.fileStorage.mkdir(this.offlineAudiobooksDir)
        await this.fileStorage.mkdir(this.downloadTasksDir)
    }

    async loadOfflineAudiobooks(): Promise<Audiobook[]> {
        const audiobooks: Audiobook[] = []
        for (const file of await this.fileStorage!.list(this.offlineAudiobooksDir)) {
            if (file.type === AppFileStorageFileType.Directory) {
                try {
                    let audiobook = JSON.parse(await this.fileStorage!.readTextFile(`${file.path}/audiobook.json`))
                    audiobook = await this.audiobookToOfflineAudiobook(this.getOfflineAudiobookDir(audiobook.id), audiobook, true)
                    if (audiobook) {
                        audiobooks.push(audiobook)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
        return audiobooks
    }

    async loadDownloadTasks(): Promise<DownloadTask[]> {
        let downloadTasks: DownloadTask[] = []
        for (const file of await this.fileStorage!.list(this.downloadTasksDir)) {
            if (file.type === AppFileStorageFileType.Directory) {
                try {
                    const audiobook = JSON.parse(await this.fileStorage!.readTextFile(`${file.path}/audiobook.json`))
                    if (audiobook) {
                        downloadTasks.push({
                            audiobook: audiobook,
                            progress: 0
                        })
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
        return downloadTasks
    }

    addEventListener<T extends EventType>(type: T, listener: EventPayloadByEvent[T] extends never ? (() => void) : ((event: EventPayloadByEvent[T]) => void)): void {
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, []);
        }
        const listeners = this.eventListeners.get(type)!
        if (listeners.find((existingListener) => existingListener === listener)) {
            return
        }
        listeners.push(listener);
    }

    private dispatch(type: EventType, event?: Event<any>) {
        if (!this.eventListeners.has(type)) return
        for (const listener of this.eventListeners.get(type)!) {
            listener(event);
        }
    }

    removeEventListener<T extends EventType>(type: T, listener: EventPayloadByEvent[T] extends never ? (() => void) : ((event: EventPayloadByEvent[T]) => void)): void {
        if (!this.eventListeners.has(type)) {
            return
        }
        const listeners = this.eventListeners.get(type)!
        const index = listeners.indexOf(listener)
        if (index > -1) {
            listeners.splice(index, 1)
        }
    }

    cancelDownload(): void {
        console.log("Cancel download task")
        this.downloadTaskAbortController?.abort()
    }

    async downloadAudiobook(audiobook: Audiobook): Promise<Audiobook | null>{
        this.downloadTaskAbortController?.abort()
        const abortController = new AbortController()
        this.downloadTaskAbortController = abortController

        let lastProgressUpdateTime = DateTimeUtils.now()

        try {
            const offlineAudiobook = await this.downloadAudiobookTask(abortController.signal, audiobook, (progress) => {
                if (DateTimeUtils.now() - lastProgressUpdateTime > 250) {
                    this.dispatch(EventType.DownloadTaskProgress, {payload: progress})
                    lastProgressUpdateTime = DateTimeUtils.now()
                }
            })

            if (offlineAudiobook) {
                this.dispatch(EventType.DownloadTaskComplete, {payload: offlineAudiobook})
            } else {
                this.dispatch(EventType.DownloadTaskCanceled, {payload: audiobook})
            }

            return offlineAudiobook
        } catch (error) {
            if (!abortController.signal.aborted) {
                console.error(error)
                this.dispatch(EventType.DownloadTaskFailed, {payload: JSON.stringify(error)})
            }
        }

        return null
    }


    private async downloadAudiobookTask(abortSignal: AbortSignal, audiobook: Audiobook, onProgress: (progress: number) => void): Promise<Audiobook|null> {
        const downloadDir = this.getDownloadTaskDir(audiobook.id)
        const mediaFiles = this.collectMediaFiles(audiobook)

        await this.fileStorage!.mkdir(downloadDir)
        await this.fileStorage!.writeTextFile(`${downloadDir}/audiobook.json`, JSON.stringify(audiobook))

        const totalSize = Math.max(mediaFiles.reduce((sum, mediaFile) => sum + mediaFile.fileSize, 0), 1)
        let bytesDownloaded = 0

        // Download media files
        for (const mediaFile of mediaFiles) {
            let mode: 'skip' | 'download' = 'download' //TODO add a resume possibility

            const mediaFilePath = `${downloadDir}/${mediaFile.fileName}`
            console.log(`Downloading media file ${mediaFilePath} from ${mediaFile.url}`)

            // Check if file is already downloaded
            if (await this.fileStorage!.fileExists(mediaFilePath)) {
                const fileSize = await this.fileStorage!.getFileSize(mediaFilePath)
                if (fileSize === mediaFile.fileSize) {
                    mode = 'skip'
                }
            }

            // Skip media file download
            if (mode === 'skip') {
                bytesDownloaded += mediaFile.fileSize
                onProgress(bytesDownloaded / totalSize)
                continue
            }

            const outputStream = await this.fileStorage!.getFileWriteableStream(mediaFilePath)
            const writer = outputStream.getWriter()

            try {
                const fetchResponse = await fetch(mediaFile.url, {signal: abortSignal})

                if (!fetchResponse.ok) {
                    if (abortSignal.aborted) return null
                    throw new Error(`Download failed, cant fetch ${mediaFile.fileName} - ${mediaFile.url}`)
                }

                console.log(fetchResponse)

                const reader = fetchResponse.body!.getReader()
                let isDone = false

                while (!isDone && !abortSignal.aborted) {
                    const {value, done} = await reader.read();

                    if (done) {
                        isDone = true
                        continue
                    }

                    await writer.write(value)
                    bytesDownloaded += value?.length ?? 0
                    onProgress(bytesDownloaded / totalSize)
                }
            } catch (error) {
                throw error
            } finally {
                await writer.close()
            }

            // Abort
            if (abortSignal.aborted) {
                return null
            }
        }

        const downloadedAudiobookDirPath = this.getOfflineAudiobookDir(audiobook.id)

        // Move the audiobook files from the download tasks to the downloaded audiobooks
        await this.fileStorage!.move(downloadDir, downloadedAudiobookDirPath)

        // Create a version of the audiobook with urls replaced with local ones
        const offlineAudiobook = await this.audiobookToOfflineAudiobook(downloadedAudiobookDirPath, audiobook, false)
        await this.fileStorage!.writeTextFile(`${downloadedAudiobookDirPath}/audiobook.json`, JSON.stringify(offlineAudiobook, null, 2))

        return offlineAudiobook
    }

    private async audiobookToOfflineAudiobook(localDirPath: string, audiobook: Audiobook, iconOnly: boolean): Promise<Audiobook> {
        async function getUrl(mediaFile: MediaFile) {
            return await appFileStorage.getFileUrl(`${localDirPath}/${mediaFile.fileName}`)
        }

        async function convert(mediaFiles: MediaFile[] | null): Promise<MediaFile[] | null> {
            if (mediaFiles === null) return null
            const result: MediaFile[] = []
            for (const mediaFile of mediaFiles) {
                result.push({...mediaFile, url: await getUrl(mediaFile)})
            }
            return result
        }

        // Icon only
        if (iconOnly) {
            return {
                ...audiobook,
                icon: audiobook.icon ? {...audiobook.icon, url: await getUrl(audiobook.icon)} : null
            }
        }

        return {
            ...audiobook,
            icon: audiobook.icon ? {...audiobook.icon, url: await getUrl(audiobook.icon)} : null,
            images: await convert(audiobook.images),
            audioFiles: await convert(audiobook.audioFiles)
        }
    }

    private collectMediaFiles(audiobook: Audiobook): MediaFile[] {
        const mediaFiles: MediaFile[] = []
        if (audiobook.icon) {
            mediaFiles.push(audiobook.icon)
        }
        if (audiobook.images) {
            for (const file of audiobook.images) {
                mediaFiles.push(file)
            }
        }
        if (audiobook.audioFiles) {
            for (const file of audiobook.audioFiles) {
                mediaFiles.push(file)
            }
        }
        return mediaFiles
    }

    async removeOfflineAudiobook(audiobookId: number): Promise<void> {
        const path = this.getOfflineAudiobookDir(audiobookId)
        if (!await this.fileStorage!.directoryExists(path)) {
            console.error(`Could not remove offline audio book audiobookId=${audiobookId}, directory not found.`)
            return
        }
        await this.fileStorage!.remove(path)
    }

    async removeDownloadTask(audiobookId: number): Promise<void> {
        const path = this.getDownloadTaskDir(audiobookId)
        if (!await this.fileStorage!.directoryExists(path)) {
            console.error(`Could not remove download task audiobookId=${audiobookId}, directory not found.`)
            return
        }
        await this.fileStorage!.remove(path)
    }

    async removeAllOfflineAudiobooks(): Promise<void> {
        await this.fileStorage!.remove(this.offlineAudiobooksDir)
        await this.fileStorage!.mkdir(this.offlineAudiobooksDir)
    }

    async removeAllDownloadTasks(): Promise<void> {
        await this.fileStorage!.remove(this.downloadTasksDir)
        await this.fileStorage!.mkdir(this.downloadTasksDir)
    }

    async getOfflineAudiobook(audiobookId:number): Promise<Audiobook> {
        const dir = this.getOfflineAudiobookDir(audiobookId)

        if (!await this.fileStorage!.directoryExists(dir)) {
            throw new OfflineAudiobookNotFound(`Offline Audiobook not found id=${audiobookId}.`)
        }

        try {
            const audiobook = JSON.parse(await this.fileStorage!.readTextFile(`${dir}/audiobook.json`))
            return await this.audiobookToOfflineAudiobook(dir, audiobook, false)
        } catch (error) {
            throw new OfflineAudiobookIntegrityCheckFailed(`Something is wrong with offline audio book id ${audiobookId}.`, error)
        }
    }
}
