import {Audiobook} from "shared";
import TrackPlayer, { Event }from 'react-native-track-player';

import {
    handleTrackPlayerEventPlaybackActiveTrackChanged,
    handleTrackPlayerEventPlaybackQueueEnded, handleTrackPlayerProgress
} from "@/src/store/CurrentlyPlaying";

import {AppDispatch} from "@/src/store";

export class AudiobookPlayer {

    protected audioFileUrls: string[] | null = null;
    protected isPlaying: boolean = false;
    protected isTrackPlayerInitialized: boolean = false;
    protected appDispatch: AppDispatch | null = null;
    protected updateTimeInterval: number | null = null;

    constructor() {}

    configure(appDispatch: AppDispatch) {
        this.appDispatch = appDispatch;
    }

    protected async setupTrackPlayer(): Promise<void> {
        if (this.isTrackPlayerInitialized) return;
        this.isTrackPlayerInitialized = true;

        await TrackPlayer.setupPlayer()

        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (data) => {
            this.isPlaying = false
            this.appDispatch?.(handleTrackPlayerEventPlaybackQueueEnded(data))
        })

        TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (data) => {
            this.appDispatch?.(handleTrackPlayerEventPlaybackActiveTrackChanged(data))
        })
    }

    async getCurrentAudioFile(): Promise<{ index: number; time: number }> {
        return {
            index: await TrackPlayer.getActiveTrackIndex() ?? 0,
            time: (await TrackPlayer.getProgress()).position*1000
        }
    }

    async pause(): Promise<void> {
        if (this.updateTimeInterval) {
            clearInterval(this.updateTimeInterval)
        }
        await TrackPlayer.pause()
        this.isPlaying = false
    }

    async play(): Promise<void> {
        await TrackPlayer.play()
        this.isPlaying = true
        this.updateTimeInterval = setInterval(
            () => {
                TrackPlayer.getProgress().then(data => {this.appDispatch?.(handleTrackPlayerProgress(data))}).catch(console.error)
            },
            1000)
    }

    async playAudioFile(audioFileIndex: number, time: number): Promise<void> {
        await TrackPlayer.skip(audioFileIndex, time/1000.0)
    }

    protected async reset() {
        if (this.isPlaying) {
            await this.pause()
        }
        await TrackPlayer.reset()
    }

    async setAudiobook(audiobook: Audiobook | null, audioFileIndex: number = 0, audioFileTime: number = 0, startPlaying: boolean | undefined = undefined): Promise<void> {
        this.audioFileUrls = audiobook?.audioFiles?.map(mf => mf.url) ?? null;

        await this.setupTrackPlayer()
        await this.reset()

        if (audiobook) {
            const tracks = this.audioFileUrls!.map(url => { return { url: url } })
            await TrackPlayer.add(tracks)

            if (audioFileIndex || audioFileTime) {
                if (audioFileIndex > 0) {
                    await this.playAudioFile(audioFileIndex, audioFileTime ?? 0)
                } else {
                    await TrackPlayer.seekBy((audioFileTime ?? 0)/1000.0)
                }
            }

            if (startPlaying) {
                await this.play()
            }
        }
    }
}
