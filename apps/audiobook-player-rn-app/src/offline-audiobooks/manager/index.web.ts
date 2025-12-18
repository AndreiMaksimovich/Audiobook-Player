import {OfflineAudiobooksManager} from "./OfflineAudiobooksManager";
import {ServiceWorkerOfflineAudiobookManagerClient} from "@/src/offline-audiobooks/manager/ServiceWorkerOfflineAudiobooksManagerClient.web";
import {UseServiceWorkerForOfflineAudiobookDownloads} from "@/src/config";
import {IOfflineAudiobooksManager} from "../Types";

export const offlineAudiobooksManager: IOfflineAudiobooksManager = UseServiceWorkerForOfflineAudiobookDownloads ? new ServiceWorkerOfflineAudiobookManagerClient() : new OfflineAudiobooksManager();
