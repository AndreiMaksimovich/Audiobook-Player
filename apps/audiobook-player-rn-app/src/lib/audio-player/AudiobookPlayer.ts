import {Audiobook} from "shared";
import TrackPlayer from '@/src/wrappers/react-native-track-player';
import {IAudiobookPlayer} from "@/src/lib/audio-player/Types";

export class AudiobookPlayer implements IAudiobookPlayer{

    protected audioFileUrls: string[] | null = null;
    protected isPlaying: boolean = false;
    protected updateTimeInterval: number | null = null;

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

    protected async reset(): Promise<void> {
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
