import {configureStore} from '@reduxjs/toolkit'
import {settingsStateSlice} from './Settings'
import {audiobookProviderApi} from "./AudiobookProviderApi";
import {setupListeners} from '@reduxjs/toolkit/query'
import {audiobookHistoryStateSlice} from "@/src/store/AudiobookHistory";
import {audiobookFavoritesStateSlice} from "@/src/store/AudiobookFavorites";
import {useDispatch} from "react-redux";
import {Event} from '@/src/track-player';
import {audiobookPlayer} from "@/src/audio-player";
import {
    currentlyPlayingStateSlice,
    handleButtonFastBackward,
    handleButtonFastForward,
    handleButtonPlay,
    handleButtonSkipBackward,
    handleButtonSkipForward,
    handleTrackPlayerEventPlaybackActiveTrackChanged, handleTrackPlayerEventPlaybackError,
    handleTrackPlayerEventPlaybackQueueEnded,
    handleTrackPlayerProgress,
} from "@/src/store/CurrentlyPlaying"
import {EventType} from "@/src/offline-audiobooks";
import {
    offlineAudiobooksStateSlice,
    handleActiveDownloadTaskProgress,
    handleActiveDownloadTaskFailure,
} from '@/src/store/OfflineAudiobooks'
import {offlineAudiobooksManager} from "@/src/offline-audiobooks"
import {handleOfflineAudiobooksActiveDownloadTaskCompletion} from "@/src/store/GlobalActions";

export const store = configureStore({
    reducer: {
        audiobookProviderApi: audiobookProviderApi.reducer,
        settings: settingsStateSlice.reducer,
        currentlyPlaying: currentlyPlayingStateSlice.reducer,
        audiobookFavorites: audiobookFavoritesStateSlice.reducer,
        audiobookHistory: audiobookHistoryStateSlice.reducer,
        offlineAudiobooks: offlineAudiobooksStateSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(audiobookProviderApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const appDispatch: AppDispatch = store.dispatch

export const useAppDispatch = (): AppDispatch => {
    return useDispatch();
}

setupListeners(store.dispatch)

// ---- Configure AudiobookPlayer

audiobookPlayer.configure({
    onPlaybackQueueEnded: (data) => store.dispatch(handleTrackPlayerEventPlaybackQueueEnded(data)),
    onTrackPlayerProgressChanged: (data) => store.dispatch(handleTrackPlayerProgress(data)),
    onPlaybackActiveTrackChanged: (data) => store.dispatch(handleTrackPlayerEventPlaybackActiveTrackChanged(data)),
    onPlaybackErrorEvent: (data) => store.dispatch(handleTrackPlayerEventPlaybackError(data)),
    onRemoteEvent: event => {
        switch (event) {
            case Event.RemotePause:
            case Event.RemotePlay:
                store.dispatch(handleButtonPlay());
                break;

            case Event.RemoteNext:
                store.dispatch(handleButtonSkipForward());
                break;
            case Event.RemotePrevious:
                store.dispatch(handleButtonSkipBackward());
                break;

            case Event.RemoteJumpBackward:
                store.dispatch(handleButtonFastBackward());
                break;
            case Event.RemoteJumpForward:
                store.dispatch(handleButtonFastForward());
                break;
        }
    },
})

// ----- Configure Offline Audiobooks

// Offline Audiobooks
offlineAudiobooksManager.addEventListener(EventType.DownloadTaskProgress, event => {
    store.dispatch(handleActiveDownloadTaskProgress(event.payload!));
})

// Download Tasks
offlineAudiobooksManager.addEventListener(EventType.DownloadTaskFailed, event => {
    store.dispatch(handleActiveDownloadTaskFailure(event.payload!));
})

// Active Download task
offlineAudiobooksManager.addEventListener(EventType.DownloadTaskComplete, event => {
    store.dispatch(handleOfflineAudiobooksActiveDownloadTaskCompletion(event.payload!));
})

