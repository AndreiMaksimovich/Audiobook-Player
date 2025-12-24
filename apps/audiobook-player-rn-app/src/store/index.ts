import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {settingsStateSlice} from './Settings'
import {audiobookProviderApi} from "./AudiobookProviderApi";
import {setupListeners} from '@reduxjs/toolkit/query'
import {audiobookHistoryStateSlice} from "@/src/store/AudiobookHistory";
import {audiobookFavoritesStateSlice} from "@/src/store/AudiobookFavorites";
import {useDispatch} from "react-redux";
import {offlineAudiobooksStateSlice} from '@/src/store/OfflineAudiobooks'
import {globalStateSlice} from "@/src/store/Global";
import {currentlyPlayingStateSlice} from "@/src/store/CurrentlyPlaying";

const rootReducer = combineReducers({
    audiobookProviderApi: audiobookProviderApi.reducer,
    global: globalStateSlice.reducer,
    settings: settingsStateSlice.reducer,
    currentlyPlaying: currentlyPlayingStateSlice.reducer,
    audiobookFavorites: audiobookFavoritesStateSlice.reducer,
    audiobookHistory: audiobookHistoryStateSlice.reducer,
    offlineAudiobooks: offlineAudiobooksStateSlice.reducer,
})

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState: preloadedState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(audiobookProviderApi.middleware)
    })
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(audiobookProviderApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = ReturnType<typeof setupStore>
export const appDispatch: AppDispatch = store.dispatch

export const useAppDispatch = (): AppDispatch => {
    return useDispatch();
}

setupListeners(store.dispatch)
