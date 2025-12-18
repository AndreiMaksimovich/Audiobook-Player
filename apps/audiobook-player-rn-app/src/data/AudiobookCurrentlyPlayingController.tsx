import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {useEffect, useState} from "react";
import {appStorage} from "@/src/data/AppStorage";
import {delay} from "@/src/utils";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {CurrentlyPlayingStateSavePeriodicity} from "@/src/config";

export interface AudiobookCurrentlyPlayingControllerProps {}

export default function AudiobookCurrentlyPlayingController(props: AudiobookCurrentlyPlayingControllerProps) {
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [audiobookId, setAudiobookId] = useState<number | null>(null);
    const [saveTime, setSaveTime] = useState<number>(0);

    useEffect(() => {
        (async () => {
            await delay(2000)
            setIsInitialized(true);
        })()
    }, []);

    useEffect(() => {
        if (isInitialized && (audiobookId !== currentlyPlaying.audiobook?.id || DateTimeUtils.now() - saveTime > CurrentlyPlayingStateSavePeriodicity)) {
            const state = {...currentlyPlaying}
            setSaveTime(Date.now())
            setAudiobookId(currentlyPlaying.audiobook?.id || null);
            appStorage.saveCurrentlyPlaying(state).catch(console.error)
        }
    }, [currentlyPlaying]);

    return (<></>)
}
