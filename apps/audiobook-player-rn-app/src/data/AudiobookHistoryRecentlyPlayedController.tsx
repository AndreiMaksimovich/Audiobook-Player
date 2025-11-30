import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {useEffect, useState} from "react";
import {addRecentlyPlayedAudiobook} from "@/src/store/AudiobookHistory";
import {getTimePlayed} from "@/src/store/CurrentlyPlaying";
import {Audiobook} from "shared";

export interface AudiobookPlayerControllerProps {}

export default function AudiobookHistoryRecentlyPlayedController(props: AudiobookPlayerControllerProps) {
    const dispatch = useDispatch();
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const [audiobookId, setAudiobookId] = useState<number | null>(currentlyPlaying.audiobook?.id ?? null);

    const [timePlayed, setTimePlayed] = useState<number>(0);
    const [audiobook, setAudiobook] = useState<Audiobook | null>(null);

    useEffect(() => {
        const id = currentlyPlaying.audiobook?.id ?? null
        if (audiobookId !== id) {
            if (audiobook) {
                dispatch(addRecentlyPlayedAudiobook({audiobook: audiobook, timePlayed: timePlayed}))
            }
            setAudiobookId(id)
        }

        if (audiobook !== currentlyPlaying.audiobook) {
            setAudiobook(currentlyPlaying.audiobook);
        }

        if (currentlyPlaying.audiobook) {
            setTimePlayed(getTimePlayed(currentlyPlaying));
        } else {
            setTimePlayed(0);
        }
    }, [currentlyPlaying]);

    return (<></>)
}
