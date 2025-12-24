import {OfflineAudiobooksManager} from "./OfflineAudiobooksManager";
import {ServiceWorkerOfflineAudiobookManagerClient} from "./ServiceWorkerOfflineAudiobooksManagerClient.web";
import {UseServiceWorkerForOfflineAudiobookDownloads} from "@/src/config";
import {IOfflineAudiobooksManager} from "../Types";

export const offlineAudiobooksManager: IOfflineAudiobooksManager = UseServiceWorkerForOfflineAudiobookDownloads ? new ServiceWorkerOfflineAudiobookManagerClient() : new OfflineAudiobooksManager();
