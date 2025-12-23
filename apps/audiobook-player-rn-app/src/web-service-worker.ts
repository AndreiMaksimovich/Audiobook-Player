///<reference lib="WebWorker" />
import {appFileStorage} from "@/src/lib/app-file-storage";
import { registerRoute, Route } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import {OfflineAudiobooksEnabled, UseServiceWorkerForOfflineAudiobookDownloads} from "@/src/config";
import {ServiceWorkerOfflineAudiobookManagerWorker} from "@/src/lib/offline-audiobooks/manager/ServiceWorkerOfflineAudiobookManagerWorker.web";

declare const self: ServiceWorkerGlobalScope;

const LogTag = 'Service-Worker:'

// ---- Cache -------------------------

const fontRoute = new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'font'
}, new NetworkFirst());

const imageRoute = new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'image'
}, new NetworkFirst());

const scriptRoute = new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'script'
}, new NetworkFirst());

const documentRoute = new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'document'
}, new NetworkFirst());

const styleRoute = new Route(({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'style'
}, new NetworkFirst());

registerRoute(fontRoute);
registerRoute(imageRoute);
registerRoute(scriptRoute);
registerRoute(documentRoute);
registerRoute(styleRoute);

// ---- Offline Audiobooks -------------------------

const offlineAudiobookManagerWorker = new ServiceWorkerOfflineAudiobookManagerWorker()

if (OfflineAudiobooksEnabled && UseServiceWorkerForOfflineAudiobookDownloads) {
    (async () => {
        await appFileStorage.init()
        await offlineAudiobookManagerWorker.init()
        console.log(LogTag, 'ServiceWorkerOfflineAudiobookManagerWorker Initialized');
    })()
}

self.addEventListener("install", function (event) {
    console.log(LogTag, 'Service worker install');
});

self.addEventListener("activate", function (event) {
    console.log(LogTag, 'Service worker activate');
});
