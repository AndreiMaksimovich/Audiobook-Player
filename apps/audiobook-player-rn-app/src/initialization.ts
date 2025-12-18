import {appFileStorage} from "@/src/app-file-storage";
import {
    setAreaOfflineAudiobooksInitialized,
    setIsPersistentStorageAvailable,
    setIsServiceWorkerRegistered
} from "@/src/store/Global";
import {offlineAudiobooksManager, WorkerState} from "@/src/offline-audiobooks";
import {
    handleActiveDownloadTaskFailure,
    handleActiveDownloadTaskProgress,
    setState as setOfflineAudiobooksState, updateActiveDownloadTask
} from "@/src/store/OfflineAudiobooks";
import { Platform } from 'react-native';
import TrackPlayer from '@/src/wrappers/react-native-track-player'
import {trackPlayerPlaybackService} from "@/src/track-player/PlaybackService";
import {appStorage} from "@/src/data/AppStorage";
import {setFavoriteAudiobooks} from "@/src/store/AudiobookFavorites";
import {setAudiobookHistory} from "@/src/store/AudiobookHistory";
import {setAudiobook} from "@/src/store/CurrentlyPlaying";
import {Dispatch} from "@reduxjs/toolkit";
import {handleOfflineAudiobooksActiveDownloadTaskCompletion} from "@/src/store/Actions";
import {Audiobook} from 'shared'
import i18next from "@/src/localization";
import {delay} from "@/src/utils";
import {setSettings, settingsInitialState} from "@/src/store/Settings";
import {getDefaultSupportedLanguageCode} from "@/src/localization/Localization";

const LogTag = 'Initialization:'

export interface InitializationOptions {
    initializeOfflineAudiobooks: boolean,
    dispatch: Dispatch,
}

export async function initializeApplicationDataAndServices(options: InitializationOptions) {
    let areOfflineAudiobooksAvailable = false;

    await Promise.all([
        loadSettings(options),
        initializeWebServiceWorker(options),
        initializeOfflineAudiobooks(options).then(value => areOfflineAudiobooksAvailable = value),
        initializeTrackPlayer(options),
        loadAudiobookHistory(options)
    ])

    await loadCurrentlyPlayedSavedState(options, areOfflineAudiobooksAvailable);
}

export async function initializeWebServiceWorker(options: InitializationOptions) {
    if (Platform.OS === 'web') {
        try {
            await navigator.serviceWorker.register("/service-worker.js", {scope: "/"})
            options.dispatch(setIsServiceWorkerRegistered(true))
            console.log(LogTag, 'Service Worker Registered');
        } catch (error) {
            console.error(LogTag, 'Service Worker registration failed', error);
        }
    }
}

export async function initializeOfflineAudiobooks(options: InitializationOptions): Promise<boolean> {
    if (!options.initializeOfflineAudiobooks) {
        return false
    }

    try {
        await appFileStorage.init()
        options.dispatch(setIsPersistentStorageAvailable(true))

        await offlineAudiobooksManager.init()

        try {
            const offlineAudiobooks = await offlineAudiobooksManager.loadOfflineAudiobooks()
            const downloadTasks = await offlineAudiobooksManager.loadDownloadTasks()

            options.dispatch(setOfflineAudiobooksState({
                offlineAudiobooks: offlineAudiobooks,
                downloadTasks: downloadTasks,
                activeDownloadTask: null
            }))

            console.log(LogTag, 'Offline audiobooks initialized')
        } catch (error) {
            console.error(LogTag, 'Retrieval of the saved offline audiobooks and download tasks failed', error)
        }

        options.dispatch(setAreaOfflineAudiobooksInitialized(true))

    } catch (error) {
        console.warn(LogTag, 'Failed to initialize app persistent storage', error);
        options.dispatch(setIsPersistentStorageAvailable(false))
        return false
    }

    // Configure offline audiobooks manager event listeners
    offlineAudiobooksManager.configure({
        onDownloadTaskProgress: (progress) => {
            options.dispatch(handleActiveDownloadTaskProgress(progress));
        },
        onDownloadTaskFailed: (error) => {
            options.dispatch(handleActiveDownloadTaskFailure(error));
        },
        onDownloadTaskComplete: (audiobook) => {
            options.dispatch(handleOfflineAudiobooksActiveDownloadTaskCompletion(audiobook));
        },
        onDownloadTaskCanceled: (audiobook?: Audiobook) => {},
        onWorkerStateChanged(state: WorkerState) {
            if (state.isActive && state.currentlyDownloading) {
                options.dispatch(updateActiveDownloadTask({
                    audiobook: state.currentlyDownloading,
                    error: null,
                    progress: state.progress,
                    isActive: true
                }))
            }
        }
    });

    return true
}

export async function initializeTrackPlayer(options: InitializationOptions) {
    await TrackPlayer.setupPlayer()
    TrackPlayer.registerPlaybackService(() => trackPlayerPlaybackService)
    console.log(LogTag, 'Track player initialized')
}

export async function loadAudiobookHistory(options: InitializationOptions) {
    try {
        const favorites = await appStorage.loadFavorites()
        const recentlyPlayed = await appStorage.loadRecentlyPlayed()
        const recentlyViewed = await appStorage.loadRecentlyViewed()

        options.dispatch(setFavoriteAudiobooks(favorites))
        options.dispatch(setAudiobookHistory({
            recentlyViewed: recentlyViewed,
            recentlyPlayed: recentlyPlayed
        }))
        console.log(LogTag, 'Audiobook history loaded')
    } catch (error) {
        console.error(LogTag, 'Failed to initialize Audiobook History', error);
    }
}

export async function loadCurrentlyPlayedSavedState(options: InitializationOptions, areOfflineAudiobooksAvailable: boolean) {
    let savedState = await appStorage.loadCurrentlyPlaying()

    if (savedState.audiobook && savedState.isOffline) {
        if (areOfflineAudiobooksAvailable) {
            savedState.audiobook = await offlineAudiobooksManager.getOfflineAudiobook(savedState.audiobook!.id)
        } else {
            savedState = {
                audiobook: null,
                currentAudioFileIndex: 0,
                currentAudioFileTime: 0,
                isPlaying: false,
                isOffline: false,
            }
        }
    }

    options.dispatch(setAudiobook({
        audiobook: savedState.audiobook,
        audioFileIndex: savedState.currentAudioFileIndex,
        audioFileTime: savedState.currentAudioFileTime,
        startPlaying: false,
        totalTime: undefined,
        isOffline: savedState.isOffline,
    }))

    console.log(LogTag, 'Audiobook currently played loaded')
}

export async function loadSettings(options: InitializationOptions) {
    while (!i18next.isInitialized) {
        await delay(50)
    }
    const defaultSettings = {...settingsInitialState}
    defaultSettings.localizationLanguageCode = getDefaultSupportedLanguageCode()
    const settings = await appStorage.loadSettings(defaultSettings);
    options.dispatch(setSettings(settings));

    console.log(LogTag, 'Settings loaded')
}
