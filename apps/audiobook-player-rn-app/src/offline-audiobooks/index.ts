import {OfflineAudiobooksManager} from "@/src/offline-audiobooks/OfflineAudiobooksManager";
import {IOfflineAudiobooksManager} from "@/src/offline-audiobooks/Types";

export * from './Types'

export const offlineAudiobooksManager: IOfflineAudiobooksManager = new OfflineAudiobooksManager();
