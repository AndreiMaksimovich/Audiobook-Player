import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {use, useEffect} from "react";
import {handleTrackPlayerProgress, setCurrentAudioFileNormalizedProgress} from "@/src/store/CurrentlyPlaying";
import TrackPlayer from "@/src/wrappers/react-native-track-player";


export default function AudioPlaybackProgressController() {
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
