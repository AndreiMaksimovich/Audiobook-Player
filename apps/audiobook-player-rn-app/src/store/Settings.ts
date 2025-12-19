import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {DefaultLanguageCode, LanguageCode} from "@/src/localization/Localization";
import i18next from "i18next";

export interface SettingsState {
    localizationLanguageCode: LanguageCode,
}

export const settingsInitialState: SettingsState = {
    localizationLanguageCode: DefaultLanguageCode,
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

    }
})

export const { setLocalizationLanguageCode, setSettings } = settingsStateSlice.actions
