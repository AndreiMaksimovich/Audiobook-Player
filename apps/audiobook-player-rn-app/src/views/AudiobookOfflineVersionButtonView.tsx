import {Audiobook} from "shared"
import {OfflineAudiobookState, useOfflineAudiobookState} from "@/src/store/OfflineAudiobooksHooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {ActivityIndicator, Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {cancelDownloadTask, downloadAudiobook} from "@/src/store/OfflineAudiobooks";
import {useState} from "react";
import DownloadTaskRemovalConfirmationModal from "@/src/views/DownloadTaskRemovalConfirmationModal";
import OfflineAudiobookRemovalConfirmationModal from "@/src/views/OfflineAudiobookRemovalConfirmationModal";
import {removeOfflineAudiobook} from "@/src/store/GlobalActions";
import {themeStyles} from "@/src/theme";

export interface AudiobookOfflineVersionButtonViewProps {
    audiobook: Audiobook
}

export default function AudiobookOfflineVersionButtonView(props: AudiobookOfflineVersionButtonViewProps) {
    const offlineAudiobooksState = useSelector((state: RootState) => state.offlineAudiobooks)
    const state = useOfflineAudiobookState(props.audiobook.id)
    const dispatch = useDispatch();

    const [isRemovalConfirmationVisible, setIsRemovalConfirmationVisible] = useState(false);
    const [isDownloadCancellationConfirmationVisible, setIsDownloadCancellationConfirmationVisible] = useState(false);

    function handlePress(): void {
        switch (state) {

            // Offline - Remove
            case OfflineAudiobookState.Offline:
                setIsRemovalConfirmationVisible(true);
                break

            // Failed - Restart
            case OfflineAudiobookState.Failed:
            // In Download Backlog - Start
            case OfflineAudiobookState.InDownloadBacklog:
            // Online - Start
            case OfflineAudiobookState.Online:
                dispatch(downloadAudiobook(props.audiobook))
                break

            // Download In Progress - Cancel
            case OfflineAudiobookState.DownloadInProgress:
                setIsDownloadCancellationConfirmationVisible(true);
                break
        }
    }

    function handleRemovalConfirmation(result: boolean): void {
        setIsRemovalConfirmationVisible(false);
        if (result && state === OfflineAudiobookState.Offline) {
            dispatch(removeOfflineAudiobook(props.audiobook.id))
        }
    }

    function handleDownloadCancellationConfirmation(result: boolean): void {
        setIsDownloadCancellationConfirmationVisible(false);
        if (result && offlineAudiobooksState.activeDownloadTask?.audiobook.id === props.audiobook.id) {
            dispatch(cancelDownloadTask(offlineAudiobooksState.activeDownloadTask))
        }
    }

    return (
        <>
            <Pressable onPress={handlePress}>
                <View style={[themeStyles.circleActionButton]}>

                    {/* Online -  */}
                    {state === OfflineAudiobookState.Online && (
                        <MaterialCommunityIcons name="arrow-down" size={30} color="black" />
                    )}

                    {/* Offline - Delete */}
                    {state === OfflineAudiobookState.Offline && (
                        <MaterialCommunityIcons name="delete-outline" size={30} color="black" />
                    )}

                    {/* Download In Progress - Cancel */}
                    {state === OfflineAudiobookState.DownloadInProgress && (
                        <>
                            <ActivityIndicator size={'large'}/>
                            <ThemedText type={"small"} style={{position: 'absolute'}}>{((offlineAudiobooksState.activeDownloadTask?.progress ?? -0.01)*100).toFixed(0)}</ThemedText>
                        </>
                    )}

                    {/* In Download Backlog - Start Download */}
                    {state === OfflineAudiobookState.InDownloadBacklog && (
                        <>
                            <MaterialCommunityIcons name="play" size={30} style={{position: 'absolute'}} color="black" />
                        </>
                    )}

                    {/* In Download Backlog - Start Download */}
                    {state === OfflineAudiobookState.DownloadPaused && (
                        <>
                            <ActivityIndicator size={'large'}/>
                            <MaterialCommunityIcons name="play" size={30} style={{position: 'absolute'}} color="black" />
                        </>
                    )}

                    {/* Download Failed - Restart */}
                    {state === OfflineAudiobookState.Failed && (
                        <>
                            <MaterialCommunityIcons name="cloud-alert-outline" size={24} style={{position: 'absolute'}} color="black" />
                        </>
                    )}

                </View>
            </Pressable>

            <OfflineAudiobookRemovalConfirmationModal
                isVisible={isRemovalConfirmationVisible}
                audiobook={props.audiobook}
                onResult={handleRemovalConfirmation} />

            <DownloadTaskRemovalConfirmationModal
                isVisible={isDownloadCancellationConfirmationVisible}
                audiobook={props.audiobook}
                onResult={handleDownloadCancellationConfirmation} />
        </>
    )
}
