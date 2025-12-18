import {useEffect} from "react";
import {serviceWorkerMessageBus} from "@/src/service-worker";
import {WorkerMessageType} from "@/src/offline-audiobooks";
import {UseServiceWorkerForOfflineAudiobookDownloads} from "@/src/config";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";

export interface ServiceWorkerControllerProps {
}

export default function ServiceWorkerController(props: ServiceWorkerControllerProps) {
    const state = useSelector((state: RootState) => state.global)

    useEffect(() => {
        (async () => {
            if (!UseServiceWorkerForOfflineAudiobookDownloads) return
            if (!state.isServiceWorkerRegistered || !state.areOfflineAudiobooksInitialized) return
            console.log('Request DownloadTask state from the service worker');
            serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Client_GetState)
        })()
    }, [state.isServiceWorkerRegistered, state.areOfflineAudiobooksInitialized])

    return (<></>)
}
