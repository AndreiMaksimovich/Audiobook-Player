///<reference lib="WebWorker" />
import {appFileStorage} from "@/src/app-file-storage";
declare const self: ServiceWorkerGlobalScope;
const LogTag = 'Service-Worker:'

import { registerRoute, Route } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

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

// Register the new route
registerRoute(fontRoute);
registerRoute(imageRoute);
registerRoute(scriptRoute);
registerRoute(documentRoute);
registerRoute(styleRoute);

self.addEventListener("install", function (event) {
    console.log(LogTag, 'Service worker install');
});

self.addEventListener("activate", function (event) {
    console.log(LogTag, 'Service worker activate');
});


//TODO PWA Service Worker DownloadTasks

// import {WorkerOfflineAudiobookManager} from "@/src/offline-audiobooks/WorkerOfflineAudiobookManager.web";
// import {offlineAudiobooksManager} from "@/src/offline-audiobooks";
// const offlineAudiobookManager = new WorkerOfflineAudiobookManager();
// (async () => {
//     console.log(LogTag, 'Initializing...');
//     await appFileStorage.init()
//     await offlineAudiobooksManager.init()
//     await offlineAudiobookManager.init()
//     console.log(LogTag, 'Initialized');
// })()
