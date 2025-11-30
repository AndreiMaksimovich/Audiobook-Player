import {Audiobook, compareAudiobooks, MediaFile} from "shared";
import {Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import HSplitterView from "@/src/views/HSplitterView";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import SpacerView from "@/src/views/SpacerView";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {Entypo} from "@expo/vector-icons";
import {setAudiobook, setIsPlaying} from "@/src/store/CurrentlyPlaying";

export interface AudiobookAudioFileRowViewProps {
    audioFileIndex: number
    audioFile: MediaFile,
    audiobook: Audiobook,
    startTime?: number
}

function getName(audioFile: MediaFile) {
    return  audioFile.name && audioFile.name.length > 0 ? audioFile.name : audioFile.fileName;
}

export default function AudiobookAudioFileRowView(props: AudiobookAudioFileRowViewProps) {
    const dispatch = useDispatch()
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const isCurrentAudioFile = currentlyPlaying.audiobook && compareAudiobooks(currentlyPlaying.audiobook, props.audiobook) && currentlyPlaying.currentAudioFileIndex == props.audioFileIndex

    function onPress() {
        if (isCurrentAudioFile) {
            dispatch(setIsPlaying(!currentlyPlaying.isPlaying))
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
        <VStackView>
            <Pressable onPress={onPress}>
                <View
                    style={[styles.container, isCurrentAudioFile ? styles.isCurrentAudioFile : styles.isNotCurrentAudioFile]}>
                    <HStackView  style={{maxWidth: "70%"}}>
                        <ThemedText type={"default"} style={{minWidth: 25}} allowFontScaling={true}>{props.audioFileIndex + 1}.</ThemedText>
                        <SpacerView size={5}/>
                        <ThemedText numberOfLines={1} type={"defaultSemiBold"}>{getName(props.audioFile)}</ThemedText>
                        {/*<SpacerView size={5}/>*/}
                        {/*<ThemedText*/}
                        {/*    type={"default"}>[{DateTimeUtils.formatDuration(props.audioFile.duration)}]</ThemedText>*/}
                    </HStackView>
                    <HStackView>
                        <ThemedText
                            type={"default"}>{props.startTime !== undefined ? DateTimeUtils.formatDuration(props.startTime) : null}</ThemedText>
                        <SpacerView size={5}/>
                        {isCurrentAudioFile && currentlyPlaying.isPlaying
                            ? (<Entypo name="controller-stop" size={26} color="black"/>)
                            : (<Entypo name="controller-play" size={26} color="black"/>)
                        }
                    </HStackView>

                </View>
            </Pressable>
            <HSplitterView/>
        </VStackView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 3,
        width: "100%",
    },
    isCurrentAudioFile: {
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    isNotCurrentAudioFile: {}
})
