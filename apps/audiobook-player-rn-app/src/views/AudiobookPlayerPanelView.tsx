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
import {Entypo, MaterialCommunityIcons} from "@expo/vector-icons";
import {HStackView} from "@/src/views/HStackView";
import {ThemedText} from "@/src/views/ThemedText";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import SpacerView from "@/src/views/SpacerView";
import {VStackView} from "@/src/views/VStackView";

export interface AudiobookPlayerPanelViewProps {
    audiobook: Audiobook,
    mode?: "offline" | "online"
}

export default function AudiobookPlayerPanelView(props: AudiobookPlayerPanelViewProps) {
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
            const timePlayed = audiobookHistory.recentlyPlayed.find(ab => ab.id == audiobook.id)?.timePlayed
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
        <VStackView alignItems={"center"}>
            <View style={{padding: 5, borderRadius: 10, borderColor: 'black', borderWidth: 1, margin: 5, width: "90%", maxWidth: 450, alignItems: "center"}}>

                <HStackView alignItems={"flex-end"} justifyContent={"center"} style={{height: 25, width: "90%"}}>
                    {isCurrentAudiobook && currentAudioFile && (
                        <>
                            <ThemedText style={{maxWidth: "70%"}} numberOfLines={1} type={"defaultSemiBold"}>{getMediaFileName(currentAudioFile)}</ThemedText>
                            {audiobook?.audioFiles && audiobook.audioFiles.length > 1 && (
                                <>
                                    <SpacerView size={5}/>
                                    <ThemedText type={"default"}>[{currentlyPlaying.currentAudioFileIndex+1}/{audiobook.audioFiles.length}]</ThemedText>
                                </>
                            )}
                        </>
                    )}
                </HStackView>

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
                <HStackView alignItems={"center"} style={{height: 20, width: "90%"}}>
                    {isCurrentAudiobook && currentAudioFile && (
                        <>
                            <ThemedText type={"default"}>{DateTimeUtils.formatDuration(currentlyPlaying.currentAudioFileTime)}</ThemedText>
                            <View style={{flexGrow: 1}}></View>
                            <ThemedText type={"default"}>{DateTimeUtils.formatDuration(currentAudioFile.duration)}</ThemedText>
                        </>
                    )}
                </HStackView>


                <HStackView justifyContent={"space-around"} alignItems={"center"} style={{width: 250}}>

                    <Pressable key={"button-skip-backward"} onPress={onButtonPressSkipBackward}>
                        <MaterialCommunityIcons name="skip-backward" size={30} color="black" />
                    </Pressable>

                    <Pressable key={"button-rewind"} onPress={onButtonPressFastBackward}>
                        <MaterialCommunityIcons name="rewind-15" size={30} color="black" />
                    </Pressable>

                    <Pressable key={"button-play"} onPress={onButtonPlayPress}>
                        {(isCurrentAudiobook && currentlyPlaying.isPlaying)
                            ? (<Entypo name="controller-stop" size={36} color="black" />)
                            : (<Entypo name="controller-play" size={36} color="black" />)
                        }
                    </Pressable>

                    <Pressable key={"button-fast-forward"} onPress={onButtonPressFastForward}>
                        <MaterialCommunityIcons name="fast-forward-15" size={30} color="black" />
                    </Pressable>

                    <Pressable key={"button-skip-forward"} onPress={onButtonPressSkipForward}>
                        <MaterialCommunityIcons name="skip-forward" size={30} color="black" />
                    </Pressable>

                </HStackView>
            </View>
        </VStackView>
    )
}

function getMediaFileName(audioFile: MediaFile) {
    return audioFile.name && audioFile.name.length > 0 ? audioFile.name : audioFile.fileName;
}
