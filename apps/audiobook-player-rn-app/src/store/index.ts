import { configureStore } from '@reduxjs/toolkit'
import {settingsStateSlice} from './Settings'
import { audiobookProviderApi } from "./AudiobookProviderApi";
import {setupListeners} from '@reduxjs/toolkit/query'
import {currentlyPlayingStateSlice} from "@/src/store/CurrentlyPlaying";
import {audiobookHistoryStateSlice} from "@/src/store/AudiobookHistory";
import {audiobookFavoritesStateSlice} from "@/src/store/AudiobookFavorites";
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: {
        audiobookProviderApi: audiobookProviderApi.reducer,
        settings: settingsStateSlice.reducer,
        currentlyPlaying: currentlyPlayingStateSlice.reducer,
        audiobookFavorites: audiobookFavoritesStateSlice.reducer,
        audiobookHistory: audiobookHistoryStateSlice.reducer,
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

// Configure Audiobook Player
import {audiobookPlayer} from "@/src/audio-player";
import {
    handleTrackPlayerEventPlaybackQueueEnded,
    handleTrackPlayerEventPlaybackActiveTrackChanged,
    handleTrackPlayerProgress
} from "./CurrentlyPlaying"

audiobookPlayer.configure({
    onPlaybackQueueEnded: (data) => store.dispatch(handleTrackPlayerEventPlaybackQueueEnded(data)),
    onTrackPlayerProgressChanged: (data) => store.dispatch(handleTrackPlayerProgress(data)),
    onPlaybackActiveTrackChanged: (data) => store.dispatch(handleTrackPlayerEventPlaybackActiveTrackChanged(data)),
})
