import {createSlice, current, type PayloadAction} from "@reduxjs/toolkit";
import {Audiobook, MediaFile} from "shared";
import {DownloadTask, offlineAudiobooksManager} from "@/src/offline-audiobooks";
import {
    handleOfflineAudiobooksActiveDownloadTaskCompletion, removeOfflineAudiobook
} from "@/src/store/GlobalActions";

export interface OfflineAudiobooksState {
    offlineAudiobooks: Audiobook[];
    downloadTasks: DownloadTask[];
    activeDownloadTask: DownloadTask | null;
}

const initialState: OfflineAudiobooksState = {
    offlineAudiobooks: [],
    downloadTasks: [],
    activeDownloadTask: null
}

function updateIsActiveOnBacklogTasks(state: OfflineAudiobooksState) {
    for (const task of state.downloadTasks) {
        if (task !== state.activeDownloadTask) {
            task.isActive = false;
        }
    }
}

function clone(audiobook: Audiobook) {
    return JSON.parse(JSON.stringify(audiobook));
}

export const offlineAudiobooksStateSlice = createSlice({
    reducerPath: 'offlineAudiobooks',
    name: "offlineAudiobooks",
    initialState,

    reducers: {
        setState: (state, action: PayloadAction<OfflineAudiobooksState>) => {
            const payload = action.payload;
            state.offlineAudiobooks = payload.offlineAudiobooks;
            state.downloadTasks = payload.downloadTasks;
            state.activeDownloadTask = payload.activeDownloadTask;
        },

        updateActiveDownloadTask: (state, action: PayloadAction<DownloadTask>) => {
            state.activeDownloadTask = action.payload;
        },

        updateOfflineAudiobooks: (state, action: PayloadAction<Audiobook[]>) => {
            state.offlineAudiobooks = action.payload;
        },

        updateDownloadTasks: (state, action: PayloadAction<DownloadTask[]>) => {
            state.downloadTasks = action.payload;
        },

        handleActiveDownloadTaskProgress: (state, action: PayloadAction<number>) => {
            if (state.activeDownloadTask) {
                state.activeDownloadTask.progress = action.payload;
            }
        },

        downloadAudiobook: (state, action: PayloadAction<Audiobook>) => {
            // Already downloaded
            if (state.offlineAudiobooks.findIndex(audiobook => audiobook.id === action.payload.id) > -1) {
                console.error(`Audiobook ${action.payload.id} - "${action.payload.title}" is already downloaded`);
                return;
            }

            // In progress - resume
            if (state.activeDownloadTask && state.activeDownloadTask.audiobook.id == action.payload.id) {
                state.activeDownloadTask.isActive = true
                state.activeDownloadTask.error = undefined;
                offlineAudiobooksManager.downloadAudiobook(clone(state.activeDownloadTask.audiobook)).catch(console.error);
                return;
            }

            // Task from backlog
            if (state.downloadTasks.findIndex(task => task.audiobook.id === action.payload.id) > -1) {
                const task = state.downloadTasks.find(task => task.audiobook.id === action.payload.id)!;
                state.activeDownloadTask = task;
                state.activeDownloadTask.isActive = true
                state.activeDownloadTask.error = undefined;
                updateIsActiveOnBacklogTasks(state)
                offlineAudiobooksManager.downloadAudiobook(clone(task.audiobook)).catch(console.error);
                return;
            }

            // Fresh download
            const task: DownloadTask = {
                audiobook: action.payload,
                progress: 0,
                isActive: true
            }
            state.downloadTasks.push(task);
            state.activeDownloadTask = task;
            updateIsActiveOnBacklogTasks(state)
            offlineAudiobooksManager.downloadAudiobook(clone(task.audiobook)).catch(console.error);
        },

        pauseActiveDownloadTask: (state) => {
            if (!state.activeDownloadTask) {
                console.error(`state.activeDownloadTask == null`);
                return
            }

            state.activeDownloadTask.isActive = false;
            offlineAudiobooksManager.cancelDownload()
        },

        handleActiveDownloadTaskFailure: (state, action: PayloadAction<any>) => {
            if (!state.activeDownloadTask) {
                console.error(`state.activeDownloadTask == null`);
                return
            }

            state.activeDownloadTask.isActive = false;
            state.activeDownloadTask.error = action.payload;
        },

        removeAllOfflineAudiobooks: (state) => {
            state.offlineAudiobooks = []
            offlineAudiobooksManager.removeAllOfflineAudiobooks().catch(console.error)
        },

        cancelDownloadTask: (state, action: PayloadAction<DownloadTask>) => {
            const task = action.payload
            const audiobook = task.audiobook

            const index = state.downloadTasks.findIndex(task => task.audiobook.id == audiobook.id)
            if (index === -1) {
                console.error(`DownloadTask not found.`);
                return
            }

            // Remove task from the state
            state.downloadTasks.splice(index, 1);

            // Current task
            if (state.activeDownloadTask?.audiobook.id === task.audiobook.id) {
                state.activeDownloadTask = null
                offlineAudiobooksManager.cancelDownload()

                // Remove and play next
                if (state.downloadTasks.length > 0) {
                    const nextTask = state.downloadTasks[0]
                    nextTask.isActive = true
                    nextTask.error = undefined
                    state.activeDownloadTask = nextTask
                    offlineAudiobooksManager.downloadAudiobook(clone(nextTask.audiobook)).catch(console.error)
                    updateIsActiveOnBacklogTasks(state)
                }
            }

            setTimeout(() => offlineAudiobooksManager.removeDownloadTask(audiobook.id).catch(console.error), 1000)
        },

        cancelAllDownloadTasks: (state, action: PayloadAction<DownloadTask[]>) => {
            if (state.activeDownloadTask !== null && state.activeDownloadTask.isActive) {
                offlineAudiobooksManager.cancelDownload()
            }
            state.downloadTasks = []
            state.activeDownloadTask = null
            offlineAudiobooksManager.removeAllDownloadTasks().catch(console.error)
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(handleOfflineAudiobooksActiveDownloadTaskCompletion, (state, action) => {
                if (!state.activeDownloadTask) {
                    console.error(`state.activeDownloadTask == null`);
                    return
                }

                state.offlineAudiobooks.push(state.activeDownloadTask.audiobook)
                state.downloadTasks.splice(state.downloadTasks.indexOf(state.activeDownloadTask), 1);
                state.activeDownloadTask = null

                // Download next audiobook from the backlog
                if (state.downloadTasks.length > 0) {
                    const task = state.downloadTasks[0]
                    state.activeDownloadTask = task;
                    state.activeDownloadTask.isActive = true
                    state.activeDownloadTask.error = undefined;
                    updateIsActiveOnBacklogTasks(state)
                    offlineAudiobooksManager.downloadAudiobook(clone(task.audiobook)).catch(console.error);
                }
            })
            .addCase(removeOfflineAudiobook, (state, action) => {
                const audiobookId = action.payload
                const index = state.offlineAudiobooks.findIndex(audiobook => audiobook.id === audiobookId);
                if (index > -1) {
                    state.offlineAudiobooks.splice(index, 1);
                    offlineAudiobooksManager.removeOfflineAudiobook(audiobookId).then(console.error);
                }
            })
    }
})

export const {
    setState,
    updateActiveDownloadTask,
    updateOfflineAudiobooks,
    updateDownloadTasks,

    handleActiveDownloadTaskProgress,
    handleActiveDownloadTaskFailure,

    removeAllOfflineAudiobooks,
    pauseActiveDownloadTask,
    downloadAudiobook,

    cancelDownloadTask,
    cancelAllDownloadTasks

} = offlineAudiobooksStateSlice.actions
