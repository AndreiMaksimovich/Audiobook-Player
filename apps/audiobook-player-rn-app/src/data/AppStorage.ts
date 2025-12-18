import AsyncStorage from '@react-native-async-storage/async-storage';
import {AudiobookHistoryRecord} from "@/src/data/AudiobookHistoryRecord";
import {CurrentlyPlayingState} from "@/src/store/CurrentlyPlaying";
import {SettingsState} from "@/src/store/Settings";

const recentlyViewedStorageKey = 'AudiobookHistory.RecentlyViewed';
const recentlyPlayedStorageKey = 'AudiobookHistory.RecentlyPlayed';
const favoritesStorageKey = 'AudiobookHistory.Favorites';
const currentlyPlayingStorageKey = 'AudiobookHistory.CurrentlyPlaying';
const settingsStorageKey = 'Settings'

export type AudiobookHistoryArray = AudiobookHistoryRecord[];

export class AppStorage {
    constructor() {}

    protected async save(key: string, value: any): Promise<void> {
        const json = JSON.stringify(value);
        await AsyncStorage.setItem(key, json);
    }

    protected async load<T>(key: string, defaultValue: T): Promise<T> {
        const json = await AsyncStorage.getItem(key);
        if (json) {
            return JSON.parse(json) ?? defaultValue;
        }
        return defaultValue;
    }

    async saveFavorites(favorites: AudiobookHistoryArray): Promise<void> {
        await this.save(favoritesStorageKey, favorites);
    }

    async loadFavorites(): Promise<AudiobookHistoryArray> {
        return await this.load<AudiobookHistoryArray>(favoritesStorageKey, []);
    }

    async saveRecentlyPlayed(historyRecords: AudiobookHistoryArray): Promise<void> {
        await this.save(recentlyPlayedStorageKey, historyRecords)
    }

    async loadRecentlyPlayed(): Promise<AudiobookHistoryArray> {
        return await this.load<AudiobookHistoryArray>(recentlyPlayedStorageKey, []);
    }

    async saveRecentlyViewed(historyRecords: AudiobookHistoryArray): Promise<void> {
        await this.save(recentlyViewedStorageKey, historyRecords)
    }

    async loadRecentlyViewed(): Promise<AudiobookHistoryArray> {
        return await this.load<AudiobookHistoryArray>(recentlyViewedStorageKey, []);
    }

    async saveCurrentlyPlaying(state: CurrentlyPlayingState): Promise<void> {
        await this.save(currentlyPlayingStorageKey, state)
    }

    async loadCurrentlyPlaying(): Promise<CurrentlyPlayingState> {
        return await this.load<CurrentlyPlayingState>(
            currentlyPlayingStorageKey,
            {
                audiobook: null,
                currentAudioFileIndex: 0,
                currentAudioFileTime: 0,
                isPlaying: false,
                isOffline: false,
            }
        )
    }

    async saveSettings(state: SettingsState): Promise<void> {
        await this.save(settingsStorageKey, state)
    }

    async loadSettings(defaultValue: SettingsState): Promise<SettingsState> {
        return await this.load<SettingsState>(settingsStorageKey, defaultValue);
    }
}

export const appStorage = new AppStorage();
