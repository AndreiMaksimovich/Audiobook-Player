import {useEffect} from "react";
import {serviceWorkerMessageBus} from "@/src/service-worker";
import {WorkerMessageType} from "@/src/offline-audiobooks";
import {toasts, ToastType} from "@/src/toasts";
import {delay} from "@/src/utils";

export interface ServiceWorkerControllerProps {
}

export default function ServiceWorkerController(props: ServiceWorkerControllerProps) {
    useEffect(() => {
        (async () => {
            await delay(2000)
            // serviceWorkerMessageBus.post(WorkerMessageType.DownloadTasks_Client_GetState) //TODO PWA Service Worker DownloadTasks
        })()
    }, [])

    return (<></>)
}
