import {RootState} from "@/src/store/index";
import {useSelector} from "react-redux";
import {Audiobook} from "shared"

export enum OfflineAudiobookState {
    Offline = 0,
    DownloadInProgress= 1,
    InDownloadBacklog= 2,
    Online = 3,
    Failed = 4,
    DownloadPaused = 5,
}

export const useOfflineAudiobookState = (audiobookId: number):OfflineAudiobookState => {
    const state = useSelector((state: RootState) => state.offlineAudiobooks);

    // Offline
    if (state.offlineAudiobooks.some(offlineAudiobook => offlineAudiobook.id === audiobookId)) {
        return OfflineAudiobookState.Offline
    }

    if (state.activeDownloadTask && state.activeDownloadTask.audiobook && state.activeDownloadTask.audiobook.id === audiobookId) {
        // In progress
        if (state.activeDownloadTask.isActive) {
            return OfflineAudiobookState.DownloadInProgress
        }

        // Failed
        if (state.activeDownloadTask.error) {
            return OfflineAudiobookState.Failed
        }

        // Paused
        return OfflineAudiobookState.DownloadPaused
    }

    // In backlog
    if (state.downloadTasks.some(task => task.audiobook.id === audiobookId)) {
        return OfflineAudiobookState.InDownloadBacklog
    }

    // Online
    return OfflineAudiobookState.Online;
}

export const useOfflineAudiobook = (audiobookId: number): Audiobook | null => {
    const state = useSelector((state: RootState) => state.offlineAudiobooks);
    return state.offlineAudiobooks.find(offlineAudiobook => offlineAudiobook.id === audiobookId) ?? null
}
