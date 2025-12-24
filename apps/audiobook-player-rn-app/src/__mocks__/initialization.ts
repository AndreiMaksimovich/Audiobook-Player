
import {appFileStorage} from "@/src/lib/app-file-storage";
import {
    setAreaOfflineAudiobooksInitialized,
    setIsPersistentStorageAvailable,
    setIsServiceWorkerRegistered
} from "@/src/store/Global";
import {offlineAudiobooksManager, WorkerState} from "@/src/lib/offline-audiobooks";
import {
    handleActiveDownloadTaskFailure,
    handleActiveDownloadTaskProgress,
    setState as setOfflineAudiobooksState, updateActiveDownloadTask
} from "@/src/store/OfflineAudiobooks";
import {appPersistentStorage} from "@/src/lib/app-persistent-storage";
import {setFavoriteAudiobooks} from "@/src/store/AudiobookFavorites";
import {setAudiobookHistory} from "@/src/store/AudiobookHistory";
import {setAudiobook} from "@/src/store/CurrentlyPlaying";
import {handleOfflineAudiobooksActiveDownloadTaskCompletion} from "@/src/store/Actions";
import {Audiobook} from 'shared'
import i18next from "@/src/localization";
import {delay, isWeb} from "@/src/utils";
import {setSettings, settingsInitialState} from "@/src/store/Settings";
import {getDefaultSupportedLanguageCode} from "@/src/localization/Localization";
import {InitializationOptions} from "@/src/initialization";

const LogTag = 'Initialization Mock:'

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

    console.log(LogTag, 'Initialization Complete');
}

export async function initializeWebServiceWorker(options: InitializationOptions) {
    options.dispatch(setIsServiceWorkerRegistered(false))
}

export async function initializeOfflineAudiobooks(options: InitializationOptions): Promise<boolean> {
    if (!options.initializeOfflineAudiobooks) {
        return false
    }

    await appFileStorage.init()
    await offlineAudiobooksManager.init()

    options.dispatch(setIsPersistentStorageAvailable(true))
    options.dispatch(setAreaOfflineAudiobooksInitialized(true))

    options.dispatch(setOfflineAudiobooksState({
        offlineAudiobooks: [], //TODO demo data
        downloadTasks: [],
        activeDownloadTask: null
    }))

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

}

export async function loadAudiobookHistory(options: InitializationOptions) {
    try {
        const favorites = await appPersistentStorage.loadFavorites()
        const recentlyPlayed = await appPersistentStorage.loadRecentlyPlayed()
        const recentlyViewed = await appPersistentStorage.loadRecentlyViewed()

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
    let savedState = await appPersistentStorage.loadCurrentlyPlaying()

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
    const settings = await appPersistentStorage.loadSettings(defaultSettings);
    options.dispatch(setSettings(settings));

    console.log(LogTag, 'Settings loaded')
}
