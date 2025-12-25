import {Audiobook} from 'shared'
import {DownloadTask} from "@/src/lib/offline-audiobooks";

export interface OfflineAudiobooksState {
    offlineAudiobooks: Audiobook[];
    downloadTasks: DownloadTask[];
    activeDownloadTask: DownloadTask | null;
}
