import {CurrentlyPlayingState} from "@/src/store/CurrentlyPlaying";
import {SettingsState} from "@/src/store/Settings";

export type AudiobookHistoryArray = AudiobookHistoryRecord[];

export interface AudiobookHistoryRecord {
    id: number;
    title: string;
    description: string | null;
    author: string | null;
    reader: string | null
    totalDuration: number;
    timePlayed: number;
    addTime: number;
}

export interface IAppPersistentStorage {
    saveFavorites(favorites: AudiobookHistoryArray): Promise<void>
    loadFavorites(): Promise<AudiobookHistoryArray>
    saveRecentlyPlayed(historyRecords: AudiobookHistoryArray): Promise<void>
    loadRecentlyPlayed(): Promise<AudiobookHistoryArray>
    saveRecentlyViewed(historyRecords: AudiobookHistoryArray): Promise<void>
    loadRecentlyViewed(): Promise<AudiobookHistoryArray>
    saveCurrentlyPlaying(state: CurrentlyPlayingState): Promise<void>
    loadCurrentlyPlaying(): Promise<CurrentlyPlayingState>
    saveSettings(state: SettingsState): Promise<void>
    loadSettings(defaultValue: SettingsState): Promise<SettingsState>
}
