import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {useEffect} from "react";
import {handleTrackPlayerProgress} from "@/src/store/CurrentlyPlaying";
import TrackPlayer from "@/src/wrappers/react-native-track-player";


export default function TrackPlayerAudioPlaybackProgressUpdater() {
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const dispatch = useDispatch()

    useEffect(() => {
        if (currentlyPlaying.isPlaying) {
            const intervalHandle = setInterval(
                () => {
                    TrackPlayer.getProgress()
                        .then((progress) => {
                            dispatch(handleTrackPlayerProgress(progress))
                        })
                        .catch(console.error)
                },
                1000
            )

            return () => {
                clearInterval(intervalHandle)
            }
        }
    }, [currentlyPlaying.isPlaying]);

    return (<></>)
}
