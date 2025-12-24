import {AudiobookHistoryArray} from "@/src/lib/app-persistent-storage";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {Audiobook} from "shared";
import {audiobookToHistoryRecord} from "@/src/lib/app-persistent-storage";
import {RecentlyPlayedAudiobooksMaxCount, RecentlyViewedAudiobooksMaxCount} from "@/src/config";

export interface AudiobookHistoryState {
    recentlyViewed: AudiobookHistoryArray
    recentlyPlayed: AudiobookHistoryArray
}

const initialState: AudiobookHistoryState = {
    recentlyPlayed: [],
    recentlyViewed: []
}

function truncateIfNeeded(array: AudiobookHistoryArray, maxCount: number) {
    if (array.length > maxCount) {
        return array.splice(array.length - maxCount, array.length);
    }
}

function findIndex(array: AudiobookHistoryArray, id: number): number {
    return array.findIndex((item) => item.id === id);
}

export const audiobookHistoryStateSlice = createSlice({
    reducerPath: 'audiobookHistory',
    name: "audiobookHistory",
    initialState,
    reducers: {

        setAudiobookHistory: (state, action: PayloadAction<AudiobookHistoryState>) => {
            const payload = action.payload
            state.recentlyPlayed = payload.recentlyPlayed
            state.recentlyViewed = payload.recentlyViewed
        },

        addRecentlyViewAudiobook: (state, action: PayloadAction<Audiobook>) => {
            const audiobook = action.payload
            const index = findIndex(state.recentlyViewed, audiobook.id)
            if (index > -1) {
                state.recentlyViewed.splice(index, 1)
            }
            state.recentlyViewed.push(audiobookToHistoryRecord(audiobook))
            truncateIfNeeded(state.recentlyViewed, RecentlyViewedAudiobooksMaxCount)
        },

        addRecentlyPlayedAudiobook: (state, action: PayloadAction<{audiobook: Audiobook, timePlayed: number}>) => {
            const audiobook = action.payload.audiobook
            const index = findIndex(state.recentlyPlayed, audiobook.id)
            if (index > -1) {
                state.recentlyPlayed.splice(index, 1)
            }
            state.recentlyPlayed.push(audiobookToHistoryRecord(audiobook, action.payload.timePlayed))
            truncateIfNeeded(state.recentlyPlayed, RecentlyPlayedAudiobooksMaxCount)
        }

    }
})

export const {setAudiobookHistory, addRecentlyViewAudiobook, addRecentlyPlayedAudiobook} = audiobookHistoryStateSlice.actions
