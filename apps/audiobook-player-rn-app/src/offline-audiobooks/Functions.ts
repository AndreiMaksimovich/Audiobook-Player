import {appFileStorage, AppFileStorageFileType, StorageIsNotPersistent} from "@/src/app-file-storage";
import {MediaFile, Audiobook} from "shared";
import {OfflineAudiobooksDir, OfflineAudiobooksDownloadTasksDir} from "@/src/config";
import {fetch} from "@/src/wrappers/fetch";
import {
    DownloadTask,
    OfflineAudiobookIntegrityCheckFailed,
    OfflineAudiobookNotFound
} from "@/src/offline-audiobooks/Types";

export async function initializeOfflineAudiobooksFileStorage() {
    await appFileStorage.mkdir(OfflineAudiobooksDir)
    await appFileStorage.mkdir(OfflineAudiobooksDownloadTasksDir)
}

export function getOfflineAudiobookDir(audiobookId: number) {
    return `${OfflineAudiobooksDir}/${audiobookId}`;
}

export function getOfflineAudiobookDownloadTaskDir(audiobookId: number) {
    return `${OfflineAudiobooksDownloadTasksDir}/${audiobookId}`;
}

export async function audiobookToOfflineAudiobook(audiobook: Audiobook, iconOnly: boolean): Promise<Audiobook> {
    const localDirPath = getOfflineAudiobookDir(audiobook.id);

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

export async function downloadAudiobook(abortSignal: AbortSignal, audiobook: Audiobook, onProgress: (progress: number) => void): Promise<Audiobook | null> {
    function collectMediaFiles(audiobook: Audiobook): MediaFile[] {
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

    const downloadDir = getOfflineAudiobookDownloadTaskDir(audiobook.id)
    const mediaFiles = collectMediaFiles(audiobook)

    const isPersistent = await appFileStorage.persist()
    if (!isPersistent) {
        // throw new StorageIsNotPersistent('is not persistent') //TODO
        console.error(new StorageIsNotPersistent('is not persistent'))
    }

    await appFileStorage.mkdir(downloadDir)
    await appFileStorage.writeTextFile(`${downloadDir}/audiobook.json`, JSON.stringify(audiobook))

    const totalSize = Math.max(mediaFiles.reduce((sum, mediaFile) => sum + mediaFile.fileSize, 0), 1)
    let bytesDownloaded = 0

    // Download media files
    for (const mediaFile of mediaFiles) {
        let mode: 'skip' | 'download' = 'download' //TODO add a resume possibility

        const mediaFilePath = `${downloadDir}/${mediaFile.fileName}`
        console.log(`Downloading media file ${mediaFilePath} from ${mediaFile.url}`)

        // Check if file is already downloaded
        if (await appFileStorage.fileExists(mediaFilePath)) {
            const fileSize = await appFileStorage.getFileSize(mediaFilePath)
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

        const outputStream = await appFileStorage.getFileWriteableStream(mediaFilePath)
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

    const downloadedAudiobookDirPath = getOfflineAudiobookDir(audiobook.id)

    // Move the audiobook files from the download tasks to the downloaded audiobooks
    await appFileStorage.move(downloadDir, downloadedAudiobookDirPath)

    return audiobook
}

export async function getOfflineAudiobook(audiobookId: number): Promise<Audiobook> {
    const dir = getOfflineAudiobookDir(audiobookId)

    if (!await appFileStorage.directoryExists(dir)) {
        throw new OfflineAudiobookNotFound(`Offline Audiobook not found id=${audiobookId}.`)
    }

    try {
        const audiobook = JSON.parse(await appFileStorage.readTextFile(`${dir}/audiobook.json`))
        return await audiobookToOfflineAudiobook(audiobook, false)
    } catch (error) {
        throw new OfflineAudiobookIntegrityCheckFailed(`Something is wrong with offline audio book id ${audiobookId}.`, error)
    }
}

export async function removeOfflineAudiobook(audiobookId: number): Promise<void> {
    const path = getOfflineAudiobookDir(audiobookId)
    if (!await appFileStorage.directoryExists(path)) {
        console.error(`Could not remove offline audio book audiobookId=${audiobookId}, directory not found.`)
        return
    }
    await appFileStorage.remove(path)
}

export async function removeDownloadTask(audiobookId: number): Promise<void> {
    const path = getOfflineAudiobookDownloadTaskDir(audiobookId)
    if (!await appFileStorage.directoryExists(path)) {
        console.error(`Could not remove download task audiobookId=${audiobookId}, directory not found.`)
        return
    }
    await appFileStorage.remove(path)
}

export async function removeAllOfflineAudiobooks(): Promise<void> {
    await appFileStorage.remove(OfflineAudiobooksDir)
    await appFileStorage.mkdir(OfflineAudiobooksDir)
}

export async function removeAllDownloadTasks(): Promise<void> {
    await appFileStorage.remove(OfflineAudiobooksDownloadTasksDir)
    await appFileStorage.mkdir(OfflineAudiobooksDownloadTasksDir)
}

export async function loadOfflineAudiobooks(): Promise<Audiobook[]> {
    const audiobooks: Audiobook[] = []
    for (const file of await appFileStorage.list(OfflineAudiobooksDir)) {
        if (file.type === AppFileStorageFileType.Directory) {
            try {
                let audiobook = JSON.parse(await appFileStorage.readTextFile(`${file.path}/audiobook.json`))
                audiobook = await audiobookToOfflineAudiobook(audiobook, true)
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

export async function loadDownloadTasks(): Promise<DownloadTask[]> {
    let downloadTasks: DownloadTask[] = []
    for (const file of await appFileStorage.list(OfflineAudiobooksDownloadTasksDir)) {
        if (file.type === AppFileStorageFileType.Directory) {
            try {
                const audiobook = JSON.parse(await appFileStorage.readTextFile(`${file.path}/audiobook.json`))
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
