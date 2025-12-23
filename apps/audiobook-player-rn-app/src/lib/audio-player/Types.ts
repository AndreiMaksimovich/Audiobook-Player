import {Audiobook} from "shared";

export interface IAudiobookPlayer {
    getCurrentAudioFile(): Promise<{ index: number; time: number }>
    pause(): Promise<void>
    play(): Promise<void>
    playAudioFile(audioFileIndex: number, time: number): Promise<void>
    setAudiobook(audiobook: Audiobook | null, audioFileIndex: number, audioFileTime: number, startPlaying?: boolean): Promise<void>
}
