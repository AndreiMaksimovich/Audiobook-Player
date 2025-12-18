import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GlobalState {
    isPersistentStorageAvailable: boolean,
    areOfflineAudiobooksInitialized: boolean,
    isServiceWorkerRegistered: boolean,
}

export const globalInitialState: GlobalState = {
    isPersistentStorageAvailable: false,
    areOfflineAudiobooksInitialized: false,
    isServiceWorkerRegistered: false,
}

export const globalStateSlice = createSlice({
    reducerPath: 'global',
    name: "global",
    initialState: globalInitialState,

    reducers: {

        setIsPersistentStorageAvailable: (state, action: PayloadAction<boolean>) => {
            state.isPersistentStorageAvailable = action.payload
        },

        setIsServiceWorkerRegistered: (state, action: PayloadAction<boolean>) => {
            state.isServiceWorkerRegistered = action.payload
        },

        setAreaOfflineAudiobooksInitialized: (state, action: PayloadAction<boolean>) => {
            state.areOfflineAudiobooksInitialized = action.payload
        }
    }
})

export const {
    setIsPersistentStorageAvailable,
    setIsServiceWorkerRegistered,
    setAreaOfflineAudiobooksInitialized
} = globalStateSlice.actions
