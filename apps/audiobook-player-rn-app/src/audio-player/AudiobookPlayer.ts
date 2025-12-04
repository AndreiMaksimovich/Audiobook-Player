import {Audiobook} from "shared";
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Event,
    PlaybackActiveTrackChangedEvent,
    Progress,
    PlaybackQueueEndedEvent,
    Capability
} from '@/src/track-player';

export interface AudiobookPlayerCallbacks {
    onPlaybackActiveTrackChanged?: (event: PlaybackActiveTrackChangedEvent) => void;
    onPlaybackQueueEnded?: (event: PlaybackQueueEndedEvent) => void;
    onTrackPlayerProgressChanged?: (progress: Progress) => void;
    onRemoteEvent?: (event: Event) => void;
}

export class AudiobookPlayer {

    protected audioFileUrls: string[] | null = null;
    protected isPlaying: boolean = false;
    protected isTrackPlayerInitialized: boolean = false;
    protected updateTimeInterval: number | null = null;

    protected callbacks?: AudiobookPlayerCallbacks;

    constructor() {}

    configure(callbacks: AudiobookPlayerCallbacks) {
        this.callbacks = callbacks;
    }

    protected async setupTrackPlayer(): Promise<void> {
        if (this.isTrackPlayerInitialized) return;
        this.isTrackPlayerInitialized = true;

        await TrackPlayer.setupPlayer()

        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.JumpBackward,
                Capability.JumpForward
            ],
            notificationCapabilities: [
                Capability.Pause,
                Capability.Play,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.JumpBackward,
                Capability.JumpForward
            ],
            android: {
                appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
            }
        })

        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (data) => {
            this.isPlaying = false
            this.callbacks?.onPlaybackQueueEnded?.(data)
        })

        TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (data) => {
            this.callbacks?.onPlaybackActiveTrackChanged?.(data)
        })

        for (const eventType of [Event.RemotePause, Event.RemotePlay, Event.RemoteNext, Event.RemotePrevious, Event.RemoteJumpBackward, Event.RemoteJumpForward,]) {
            TrackPlayer.addEventListener(eventType, () => {this.callbacks?.onRemoteEvent?.(eventType)})
        }
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
                TrackPlayer.getProgress().then(data => {this.callbacks?.onTrackPlayerProgressChanged?.(data)}).catch(console.error)
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
