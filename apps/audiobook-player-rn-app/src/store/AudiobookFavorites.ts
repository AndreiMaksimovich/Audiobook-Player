import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {Audiobook} from "shared";
import {audiobookToHistoryRecord, AudiobookHistoryArray} from "@/src/lib/app-persistent-storage";

export interface AudiobookFavoritesState {
    favorites: AudiobookHistoryArray
}

const initialState: AudiobookFavoritesState = {
    favorites: []
}

function isFavorite(state: AudiobookFavoritesState, audiobookId: number): boolean {
    return state.favorites.some(fav => fav.id === audiobookId);
}

export const audiobookFavoritesStateSlice = createSlice({
    reducerPath: 'audiobookFavorites',
    name: "audiobookFavorites",
    initialState,
    reducers: {

        setFavoriteAudiobooks: (state, action: PayloadAction<AudiobookHistoryArray>) => {
            state.favorites = action.payload
        },

        addFavoriteAudiobook: (state, action: PayloadAction<Audiobook>) => {
            if (!isFavorite(state, action.payload.id)) {
                state.favorites.push(audiobookToHistoryRecord(action.payload))
            }
        },

        removeFavoriteAudiobook: (state, action: PayloadAction<number>) => {
            if (isFavorite(state, action.payload)) {
                state.favorites = state.favorites.filter(fav => fav.id !== action.payload)
            }
        }
    }
})

export const { setFavoriteAudiobooks, addFavoriteAudiobook, removeFavoriteAudiobook } = audiobookFavoritesStateSlice.actions
