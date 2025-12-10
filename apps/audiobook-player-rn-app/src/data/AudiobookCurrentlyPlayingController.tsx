import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {useEffect, useState} from "react";
import {setAudiobook} from "@/src/store/CurrentlyPlaying";
import {appStorage} from "@/src/data/AppStorage";
import {delay} from "@/src/utils";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {CurrentlyPlayingStateSavePeriodicity} from "@/src/config";
import {offlineAudiobooksManager} from "@/src/offline-audiobooks";

export interface AudiobookCurrentlyPlayingControllerProps {}

export default function AudiobookCurrentlyPlayingController(props: AudiobookCurrentlyPlayingControllerProps) {
    const dispatch = useDispatch();
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [audiobookId, setAudiobookId] = useState<number | null>(null);
    const [saveTime, setSaveTime] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const savedState = await appStorage.loadCurrentlyPlaying()

            if (savedState.audiobook && savedState.isOffline) {
                await delay(250)
                savedState.audiobook = await offlineAudiobooksManager.getOfflineAudiobook(savedState.audiobook!.id)
            }

            dispatch(setAudiobook({
                audiobook: savedState.audiobook,
                audioFileIndex: savedState.currentAudioFileIndex,
                audioFileTime: savedState.currentAudioFileTime,
                startPlaying: false,
                totalTime: undefined,
                isOffline: savedState.isOffline,
            }))
            setAudiobookId(savedState.audiobook?.id ?? null)

            await delay(250)

            setIsInitialized(true);
        })()
    }, []);

    useEffect(() => {
        if (isInitialized && (audiobookId !== currentlyPlaying.audiobook?.id || DateTimeUtils.now() - saveTime > CurrentlyPlayingStateSavePeriodicity)) {
            const state = {...currentlyPlaying}
            setSaveTime(Date.now())
            appStorage.saveCurrentlyPlaying(state).catch(console.error)
        }
    }, [currentlyPlaying]);

    return (<></>)
}
