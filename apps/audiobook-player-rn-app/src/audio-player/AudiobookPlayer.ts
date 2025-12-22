import {Audiobook} from "shared";
import TrackPlayer, {
    Event,
    PlaybackActiveTrackChangedEvent,
    Progress,
    PlaybackQueueEndedEvent,
    PlaybackErrorEvent
} from '@/src/wrappers/react-native-track-player';

export interface AudiobookPlayerCallbacks {
    onPlaybackActiveTrackChanged?: (event: PlaybackActiveTrackChangedEvent) => void;
    onPlaybackQueueEnded?: (event: PlaybackQueueEndedEvent) => void;
    onTrackPlayerProgressChanged?: (progress: Progress) => void;
    onRemoteEvent?: (event: Event) => void;
    onPlaybackErrorEvent?: (event: PlaybackErrorEvent) => void;
}

export class AudiobookPlayer {

    protected audioFileUrls: string[] | null = null;
    protected isPlaying: boolean = false;
    protected updateTimeInterval: number | null = null;

    protected callbacks?: AudiobookPlayerCallbacks;

    configure(callbacks: AudiobookPlayerCallbacks) {
        this.callbacks = callbacks;
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
