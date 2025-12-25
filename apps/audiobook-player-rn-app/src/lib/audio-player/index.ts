import {AudiobookPlayer} from "@/src/lib/audio-player/AudiobookPlayer";
import {IAudiobookPlayer} from "@/src/lib/audio-player/Types";

export * from './Types'

export const audiobookPlayer: IAudiobookPlayer = new AudiobookPlayer()
