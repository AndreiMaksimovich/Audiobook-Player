import {createAction} from "@reduxjs/toolkit";
import {Audiobook} from "shared"

export const handleOfflineAudiobooksActiveDownloadTaskCompletion = createAction<Audiobook>('handleOfflineAudiobooksActiveDownloadTaskCompletion')

export const removeOfflineAudiobook = createAction<number>('removeOfflineAudiobook')
