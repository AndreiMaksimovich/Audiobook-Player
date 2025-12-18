import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {DefaultLanguageCode, LanguageCode} from "@/src/localization/Localization";
import i18next from "i18next";

export interface SettingsState {
    localizationLanguageCode: LanguageCode,
    isPersistentStorageAvailable: boolean,
    areOfflineAudiobooksEnabled: boolean,
}

export const settingsInitialState: SettingsState = {
    localizationLanguageCode: DefaultLanguageCode,
    isPersistentStorageAvailable: false,
    areOfflineAudiobooksEnabled: true,
}

export const settingsStateSlice = createSlice({
    reducerPath: 'settings',
    name: "settings",
    initialState: settingsInitialState,

    reducers: {

        setSettings(state, action: PayloadAction<SettingsState>) {
            state.localizationLanguageCode = action.payload.localizationLanguageCode
            i18next.changeLanguage(action.payload.localizationLanguageCode).catch(console.error)
        },

        setLocalizationLanguageCode: (state, action: PayloadAction<LanguageCode>) => {
            state.localizationLanguageCode = action.payload
            i18next.changeLanguage(action.payload).catch(console.error)
        },

        setIsPersistentStorageAvailable: (state, action: PayloadAction<boolean>) => {
            state.isPersistentStorageAvailable = action.payload
        }
    }
})

export const { setLocalizationLanguageCode, setSettings, setIsPersistentStorageAvailable } = settingsStateSlice.actions
