import {configureStore} from '@reduxjs/toolkit'
import {settingsStateSlice} from './Settings'
import {audiobookProviderApi} from "./AudiobookProviderApi";
import {setupListeners} from '@reduxjs/toolkit/query'
import {audiobookHistoryStateSlice} from "@/src/store/AudiobookHistory";
import {audiobookFavoritesStateSlice} from "@/src/store/AudiobookFavorites";
import {useDispatch} from "react-redux";
import {currentlyPlayingStateSlice} from "@/src/store/CurrentlyPlaying"
import {offlineAudiobooksStateSlice} from '@/src/store/OfflineAudiobooks'

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
