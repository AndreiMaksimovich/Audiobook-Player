import {Audiobook, compareAudiobooks, MediaFile} from "shared";
import {Pressable, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {
    setAudiobook,
    handleButtonFastForward,
    handleButtonFastBackward,
    handleButtonSkipForward,
    handleButtonSkipBackward,
    handleButtonPlay, setCurrentAudioFileNormalizedProgress, getCurrentAudioFile, getTimePlayed
} from "@/src/store/CurrentlyPlaying";
import Slider from "@react-native-community/slider";
import {useEffect, useState} from "react";
import {HStack} from "@/src/components/common/HStack";
import {ThemedText} from "@/src/components/common/ThemedText";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import Spacer from "@/src/components/common/Spacer";
import {VStack} from "@/src/components/common/VStack";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface AudiobookPlayerPanelProps {
    audiobook: Audiobook,
    mode?: "offline" | "online"
}

export default function AudiobookPlayerPanel(props: AudiobookPlayerPanelProps) {
    const currentlyPlaying = useSelector((state: RootState) => state.currentlyPlaying)
    const audiobookHistory = useSelector((state: RootState) => state.audiobookHistory)

    const dispatch = useDispatch()

    const isCurrentAudiobook = currentlyPlaying.audiobook && compareAudiobooks(props.audiobook, currentlyPlaying.audiobook)
    const currentAudioFile = getCurrentAudioFile(currentlyPlaying)
    const audiobook = props.audiobook

    const [progress, setProgress] = useState<number>(isCurrentAudiobook && currentAudioFile ? currentlyPlaying.currentAudioFileTime/currentAudioFile.duration : 0);

    const onButtonPlayPress = () => {
        if (isCurrentAudiobook) {
            dispatch(handleButtonPlay());
        } else {
            const timePlayed = audiobookHistory.recentlyPlayed.find(ab => ab.id === audiobook.id)?.timePlayed
            dispatch(setAudiobook({
                audiobook: props.audiobook,
                totalTime: timePlayed,
                startPlaying: true,
                audioFileTime: undefined,
                audioFileIndex: undefined,
                isOffline: props.mode === "offline",
            }))
        }
    }

    function onButtonPressFastForward() {
        if (isCurrentAudiobook) {
            dispatch(handleButtonFastForward());
        }
    }

    function onButtonPressFastBackward() {
        if (isCurrentAudiobook) {
            dispatch(handleButtonFastBackward());
        }
    }

    function onButtonPressSkipBackward() {
        if (isCurrentAudiobook) {
            dispatch(handleButtonSkipBackward());
        }
    }

    function onButtonPressSkipForward() {
        if (isCurrentAudiobook) {
            dispatch(handleButtonSkipForward());
        }
    }

    function onSliderValueChanged(value: number) {
        if (isCurrentAudiobook) {
            dispatch(setCurrentAudioFileNormalizedProgress(value))
            setProgress(value)
        }
    }

    useEffect(() => {
        if (!isCurrentAudiobook) return
        if (currentAudioFile) {
            setProgress(currentlyPlaying.currentAudioFileTime / currentAudioFile.duration)
        }
    }, [currentlyPlaying.currentAudioFileTime]);

    return (
        <VStack alignItems={"center"}>
            <View style={{padding: 5, borderRadius: 10, borderColor: 'black', borderWidth: 1, margin: 5, width: "90%", maxWidth: 450, alignItems: "center"}}>

                <HStack alignItems={"flex-end"} justifyContent={"center"} style={{height: 25, width: "90%"}}>
                    {isCurrentAudiobook && currentAudioFile && (
                        <>
                            <ThemedText style={{maxWidth: "70%"}} numberOfLines={1} type={"defaultSemiBold"}>{getMediaFileName(currentAudioFile)}</ThemedText>
                            {audiobook?.audioFiles && audiobook.audioFiles.length > 1 && (
                                <>
                                    <Spacer size={5}/>
                                    <ThemedText type={"default"}>[{currentlyPlaying.currentAudioFileIndex+1}/{audiobook.audioFiles.length}]</ThemedText>
                                </>
                            )}
                        </>
                    )}
                </HStack>

                <Slider
                    style={{width: "90%", height: 40}}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="black"
                    maximumTrackTintColor="gray"
                    value={progress}
                    disabled={!isCurrentAudiobook}
                    onValueChange={onSliderValueChanged}
                />
                <HStack alignItems={"center"} style={{height: 20, width: "90%"}}>
                    {isCurrentAudiobook && currentAudioFile && (
                        <>
                            <ThemedText type={"default"}>{DateTimeUtils.formatDuration(currentlyPlaying.currentAudioFileTime)}</ThemedText>
                            <View style={{flexGrow: 1}}></View>
                            <ThemedText type={"default"}>{DateTimeUtils.formatDuration(currentAudioFile.duration)}</ThemedText>
                        </>
                    )}
                </HStack>


                <HStack justifyContent={"space-around"} alignItems={"center"} style={{width: 250}}>

                    <Pressable key={"button-skip-backward"} onPress={onButtonPressSkipBackward}>
                        <MaterialIcons name="skip-previous" size={30} color="black" />
                    </Pressable>

                    <Pressable key={"button-rewind"} onPress={onButtonPressFastBackward}>
                        <MaterialIcons name="fast-rewind" size={30} color="black" />
                    </Pressable>

                    <Pressable key={"button-play"} onPress={onButtonPlayPress}>
                        {(isCurrentAudiobook && currentlyPlaying.isPlaying)
                            ? (<MaterialIcons name="pause" size={36} color="black" />)
                            : (<MaterialIcons name="play-arrow" size={36} color="black" />)
                        }
                    </Pressable>

                    <Pressable key={"button-fast-forward"} onPress={onButtonPressFastForward}>
                        <MaterialIcons name="fast-forward" size={30} color="black" />
                    </Pressable>

                    <Pressable key={"button-skip-forward"} onPress={onButtonPressSkipForward}>
                        <MaterialIcons name="skip-next" size={30} color="black" />
                    </Pressable>

                </HStack>
            </View>
        </VStack>
    )
}

function getMediaFileName(audioFile: MediaFile) {
    return audioFile.name && audioFile.name.length > 0 ? audioFile.name : audioFile.fileName;
}
