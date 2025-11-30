import {Audiobook, compareAudiobooks} from "shared";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {Pressable} from "react-native";
import {setAudiobook, setIsPlaying} from "@/src/store/CurrentlyPlaying";
import {Entypo} from "@expo/vector-icons";

export interface AudiobookPlayAudioFileIconButtonViewProps {
    audiobook: Audiobook,
    audioFileIndex: number | undefined
}

export default function AudiobookPlayAudioFileIconButtonView(props: AudiobookPlayAudioFileIconButtonViewProps) {
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const dispatch = useDispatch()

    const isCurrentAudiobook = currentlyPlaying.audiobook && compareAudiobooks(currentlyPlaying.audiobook, props.audiobook)
    const isCurrentlyPlaying = isCurrentAudiobook && currentlyPlaying.isPlaying && (props.audioFileIndex === undefined || currentlyPlaying.currentAudioFileIndex == props.audioFileIndex)

    function onButtonPress() {
        if (isCurrentlyPlaying) {
            dispatch(setIsPlaying(false))
        } else {
            dispatch(setAudiobook({
                audiobook: props.audiobook,
                startPlaying: true,
                audioFileIndex: props.audioFileIndex ?? 0,
                audioFileTime: 0,
                totalTime: undefined
            }))
        }
    }

    return (
        <Pressable key={"button-play"} onPress={onButtonPress}>
            {isCurrentlyPlaying
                ? (<Entypo name="controller-stop" size={26} color="black" />)
                : (<Entypo name="controller-play" size={26} color="black" />)
            }
        </Pressable>
    )
}
