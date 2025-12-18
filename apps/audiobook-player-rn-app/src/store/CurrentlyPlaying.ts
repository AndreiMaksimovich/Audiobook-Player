import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from '@reduxjs/toolkit'
import {Audiobook, MediaFile} from "shared";
import {audiobookPlayer} from "@/src/audio-player";
import {PlaybackActiveTrackChangedEvent, PlaybackQueueEndedEvent, PlaybackState, Progress, PlaybackErrorEvent, State} from '@/src/wrappers/react-native-track-player';
import {AudioPlaybackFastBackwardDuration, AudioPlaybackFastForwardDuration} from "@/src/config";
import {handleOfflineAudiobooksActiveDownloadTaskCompletion, removeOfflineAudiobook} from "@/src/store/GlobalActions";
import {toasts, ToastType} from "@/src/toasts";
import i18next from '@/src/localization'

export interface CurrentlyPlayingState {
    audiobook: Audiobook | null,
    currentAudioFileIndex: number,
    currentAudioFileTime: number,
    isPlaying: boolean,
    isOffline: boolean
}

const initialState: CurrentlyPlayingState = {
    audiobook: null,
    currentAudioFileIndex: 0,
    currentAudioFileTime: 0,
    isPlaying: false,
    isOffline: false
}

function setTime(state: CurrentlyPlayingState, time: number) {
    const audiobook = state.audiobook
    if (audiobook) {
        let duration = 0
        for (let i=0; i<audiobook.audioFiles!.length; i++) {
            duration += audiobook.audioFiles![i].duration
            if (duration > time) {
                state.currentAudioFileIndex = i
                state.currentAudioFileTime = time - duration + audiobook.audioFiles![i].duration
                break;
            }
        }
    }
}

let _getAudiobookTimePlayedCache = [-1, -1, -1]

export function getAudiobookTimePlayed(audiobook: Audiobook, audioFileCount: number, time: number = 0): number {
    if (_getAudiobookTimePlayedCache[0] == audiobook.id && _getAudiobookTimePlayedCache[1] == audioFileCount) {
        return _getAudiobookTimePlayedCache[2] + time
    }

    let result = 0
    for (let i=0; i<audioFileCount; i++) {
        result += audiobook.audioFiles![i].duration
    }

    _getAudiobookTimePlayedCache = [audiobook.id, audioFileCount, result]
    return result + time
}

export function getTimePlayed(state: CurrentlyPlayingState) {
    if (!state.audiobook) return 0
    return getAudiobookTimePlayed(state.audiobook, state.currentAudioFileIndex, state.currentAudioFileTime)
}

export function getCurrentAudioFile(state: CurrentlyPlayingState): MediaFile | null {
    return state.audiobook?.audioFiles?.[state.currentAudioFileIndex] ?? null;
}

let ignoreTrackPlayerEventPlaybackActiveTrackChanged = false

export const currentlyPlayingStateSlice = createSlice({
    reducerPath: 'currentlyPlaying',
    name: "currentlyPlaying",
    initialState,
    reducers: {

        setAudiobook: (state, action: PayloadAction<{audiobook: Audiobook | null, totalTime: number | undefined, audioFileIndex: number | undefined, audioFileTime: number | undefined, startPlaying: boolean, isOffline: boolean}>) => {
            state.audiobook = action.payload.audiobook
            state.currentAudioFileIndex = 0
            state.currentAudioFileTime = 0
            state.isPlaying = action.payload.startPlaying
            state.isOffline = action.payload.isOffline

            if (action.payload.audiobook) {
                if (action.payload.totalTime) {
                    setTime(state, action.payload.totalTime)
                } else {
                    setTime(state, getAudiobookTimePlayed(action.payload.audiobook, action.payload.audioFileIndex ?? 0, action.payload.audioFileTime ?? 0))
                }
                const audiobook = state.audiobook
                ignoreTrackPlayerEventPlaybackActiveTrackChanged = true
                audiobookPlayer.setAudiobook(audiobook, state.currentAudioFileIndex, state.currentAudioFileTime, action.payload.startPlaying).catch(console.error).finally(() => {
                    ignoreTrackPlayerEventPlaybackActiveTrackChanged = false
                })
            }
        },

        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload
            if (state.audiobook) {
                if (state.isPlaying) {
                    audiobookPlayer.play().catch(console.error)
                } else{
                    audiobookPlayer.pause().catch(console.error)
                }
            }
        },

        handleTrackPlayerEventPlaybackQueueEnded: (state, action: PayloadAction<PlaybackQueueEndedEvent>) => {
            state.isPlaying = false
            state.currentAudioFileIndex = 0
            state.currentAudioFileTime = 0
        },

        handleTrackPlayerEventPlaybackActiveTrackChanged: (state, action: PayloadAction<PlaybackActiveTrackChangedEvent>) => {
            if (ignoreTrackPlayerEventPlaybackActiveTrackChanged) return
            const index = action.payload.index
            if (index !== undefined && state.currentAudioFileIndex !== index) {
                state.currentAudioFileIndex = index
                state.currentAudioFileTime = 0
            }
        },

        handleTrackPlayerProgress: (state, action: PayloadAction<Progress>) => {
            state.currentAudioFileTime = action.payload.position * 1000
        },

        handleButtonFastForward: (state, action: PayloadAction<void>) => {
            const audioFile = getCurrentAudioFile(state)
            if (!audioFile) return
            const time = Math.min(state.currentAudioFileTime + AudioPlaybackFastForwardDuration, audioFile.duration)
            audiobookPlayer.playAudioFile(state.currentAudioFileIndex, time).catch(console.error)
        },

        handleButtonFastBackward: (state, action: PayloadAction<void>) => {
            if (!state.audiobook) return
            const time = Math.max(state.currentAudioFileTime - AudioPlaybackFastBackwardDuration, 0)
            state.currentAudioFileTime = time
            audiobookPlayer.playAudioFile(state.currentAudioFileIndex, time).catch(console.error)
        },

        handleButtonSkipForward: (state, action: PayloadAction<void>) => {
            if (!state.audiobook) return
            if (state.currentAudioFileIndex + 1 >= state.audiobook.audioFiles!.length) return;
            state.currentAudioFileIndex += 1
            state.currentAudioFileTime = 0
            audiobookPlayer.playAudioFile(state.currentAudioFileIndex, state.currentAudioFileTime).catch(console.error)
        },

        handleButtonSkipBackward: (state, action: PayloadAction<void>) => {
            if (!state.audiobook) return
            if (state.currentAudioFileIndex == 0) return;
            state.currentAudioFileIndex -= 1
            state.currentAudioFileTime = 0
            audiobookPlayer.playAudioFile(state.currentAudioFileIndex, state.currentAudioFileTime).catch(console.error)
        },

        handleButtonPlay: (state, action: PayloadAction<void>) => {
            if (!state.audiobook) return
            state.isPlaying = !state.isPlaying
            if (state.isPlaying) {
                audiobookPlayer.play().catch(console.error)
            } else{
                audiobookPlayer.pause().catch(console.error)
            }
        },

        handleTrackPlayerStateChange: (state, action: PayloadAction<PlaybackState>) => {
            const playbackState = action.payload.state
            if (playbackState === State.Playing && !state.isPlaying) {
                state.isPlaying = true
            } else if ((playbackState === State.Error || playbackState === State.None || playbackState === State.Ended || playbackState === State.Paused || playbackState === State.Stopped) && state.isPlaying) {
                state.isPlaying = false
            }
        },

        handleRemoteButtonPlay: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload
        },

        setCurrentAudioFileNormalizedProgress: (state, action: PayloadAction<number>) => {
            const audioFile = getCurrentAudioFile(state)
            if (!audioFile) return
            state.currentAudioFileTime = audioFile.duration * action.payload
            audiobookPlayer.playAudioFile(state.currentAudioFileIndex, state.currentAudioFileTime).catch(console.error)
        },

        handleTrackPlayerEventPlaybackError: (state, action: PayloadAction<PlaybackErrorEvent>) => {
            if (state.isPlaying) {
                state.isPlaying = false
            }
            console.error(action.payload)
            toasts.show(ToastType.Error, i18next.t('AudiobookPlaybackError.ToastMessage').replace('{message}', action.payload.message))
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(handleOfflineAudiobooksActiveDownloadTaskCompletion, (state, action) => {
                if (state.audiobook && state.audiobook?.id === action.payload.id) {
                    state.audiobook = action.payload
                    state.isOffline = true
                    ignoreTrackPlayerEventPlaybackActiveTrackChanged = true
                    audiobookPlayer.setAudiobook(state.audiobook, state.currentAudioFileIndex, state.currentAudioFileTime, state.isPlaying).catch(console.error).finally(() => {
                        ignoreTrackPlayerEventPlaybackActiveTrackChanged = false
                    })
                }
            })
            .addCase(removeOfflineAudiobook, (state, action) => {
                if (state.audiobook && state.audiobook.id === action.payload) {
                    state.isPlaying = false
                    state.currentAudioFileIndex = 0
                    state.currentAudioFileTime = 0
                    state.audiobook = null
                    state.isOffline = false
                    audiobookPlayer.pause().catch(console.error)
                }
            })
    }
})

export const {
    setAudiobook,
    setIsPlaying,
    handleTrackPlayerEventPlaybackQueueEnded,
    handleTrackPlayerEventPlaybackActiveTrackChanged,
    handleTrackPlayerProgress,
    handleButtonFastForward,
    handleButtonFastBackward,
    handleButtonSkipForward,
    handleButtonSkipBackward,
    handleButtonPlay,
    setCurrentAudioFileNormalizedProgress,
    handleTrackPlayerEventPlaybackError,
    handleTrackPlayerStateChange,
    handleRemoteButtonPlay
} = currentlyPlayingStateSlice.actions
