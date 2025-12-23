import {Audiobook, compareAudiobooks, MediaFile} from "shared";
import {Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/src/components/common/ThemedText";
import {VStack} from "@/src/components/common/VStack";
import {HStack} from "@/src/components/common/HStack";
import HSplitter from "@/src/components/common/HSplitter";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import Spacer from "@/src/components/common/Spacer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {setAudiobook, setIsPlaying} from "@/src/store/CurrentlyPlaying";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface AudiobookAudioFileRowProps {
    audioFileIndex: number
    audioFile: MediaFile,
    audiobook: Audiobook,
    startTime?: number,
    mode?: "offline" | "online"
}

function getName(audioFile: MediaFile) {
    return  audioFile.name && audioFile.name.length > 0 ? audioFile.name : audioFile.fileName;
}

export default function AudiobookAudioFileRow(props: AudiobookAudioFileRowProps) {
    const isOffline = props.mode === "offline";
    const dispatch = useDispatch()
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const isCurrentAudioFile = currentlyPlaying.audiobook && compareAudiobooks(currentlyPlaying.audiobook, props.audiobook) && currentlyPlaying.currentAudioFileIndex === props.audioFileIndex

    function onPress() {
        if (isCurrentAudioFile) {
            dispatch(setIsPlaying(!currentlyPlaying.isPlaying))
        } else {
            dispatch(setAudiobook({
                audiobook: props.audiobook,
                startPlaying: true,
                audioFileIndex: props.audioFileIndex ?? 0,
                audioFileTime: 0,
                totalTime: undefined,
                isOffline: isOffline
            }))
        }
    }

    return (
        <VStack>
            <Pressable onPress={onPress}>
                <View
                    style={[styles.container, isCurrentAudioFile ? styles.isCurrentAudioFile : styles.isNotCurrentAudioFile]}>
                    <HStack style={{maxWidth: "70%"}}>
                        <ThemedText type={"default"} style={{minWidth: 25}} allowFontScaling={true}>{props.audioFileIndex + 1}.</ThemedText>
                        <Spacer size={5}/>
                        <ThemedText numberOfLines={1} type={"defaultSemiBold"}>{getName(props.audioFile)}</ThemedText>
                    </HStack>
                    <HStack>
                        <ThemedText
                            type={"default"}>{props.startTime !== undefined ? DateTimeUtils.formatDuration(props.startTime) : null}</ThemedText>
                        <Spacer size={5}/>
                        {isCurrentAudioFile && currentlyPlaying.isPlaying
                            ? (<MaterialIcons name="pause" size={26} color="black"/>)
                            : (<MaterialIcons name="play-arrow" size={26} color="black"/>)
                        }
                    </HStack>

                </View>
            </Pressable>
            <HSplitter/>
        </VStack>
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
