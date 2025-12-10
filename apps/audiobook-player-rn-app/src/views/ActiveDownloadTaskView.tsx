import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {Pressable, StyleSheet, View} from "react-native";
import {AudiobookLinkView} from "@/src/views/AudiobookLinkView";
import {ThemedText} from "@/src/views/ThemedText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useState} from "react";
import {cancelDownloadTask, downloadAudiobook, pauseActiveDownloadTask} from "@/src/store/OfflineAudiobooks";
import Slider from "@react-native-community/slider";
import SpacerView from "@/src/views/SpacerView";
import DownloadTaskRemovalConfirmationModal from "@/src/views/DownloadTaskRemovalConfirmationModal";

export interface ActiveDownloadTaskViewProps {
}

export default function ActiveDownloadTaskView(props: ActiveDownloadTaskViewProps) {
    const offlineAudiobooks = useSelector((state: RootState) => state.offlineAudiobooks)
    const activeDownloadTask = offlineAudiobooks.activeDownloadTask;
    const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false)
    const dispatch = useDispatch()

    function resumePauseTask() {
        if (!activeDownloadTask) {
            return;
        }

        if (activeDownloadTask.isActive) {
            dispatch(pauseActiveDownloadTask())
        } else {
            dispatch(downloadAudiobook(activeDownloadTask.audiobook))
        }
    }

    function onDeleteButtonPress() {
        setIsDeleteConfirmationModalVisible(true);
    }

    function deleteConfirmationModalResult(result: boolean) {
        setIsDeleteConfirmationModalVisible(false);
        if (result && activeDownloadTask) {
            dispatch(cancelDownloadTask(activeDownloadTask))
        }
    }

    if (!activeDownloadTask) {
        return null
    }

    const audiobook = activeDownloadTask.audiobook

    return (

        <View style={styles.container}>
            <AudiobookLinkView audiobookId={audiobook.id}>
                <ThemedText type={"subtitle"}>{audiobook.title}</ThemedText>
            </AudiobookLinkView>
            <SpacerView size={5}/>
            <View style={styles.buttonContainer}>
                <Pressable key={"play-pause-button"} onPress={resumePauseTask}>
                    <MaterialCommunityIcons
                        name={activeDownloadTask.isActive ? "pause-circle-outline" : "play-circle-outline"} size={36}
                        color="black"/>
                </Pressable>

                <View style={{
                    flexGrow: 1,
                    maxWidth: "70%",
                    alignItems: "center"
                }}>
                    <Slider
                        style={{height: 40, width: "100%"}}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor="black"
                        maximumTrackTintColor="gray"
                        value={activeDownloadTask.progress}
                        disabled={true}
                    />
                    <ThemedText type={"default"}>{((activeDownloadTask.progress ?? 0) * 100).toFixed(2)}%</ThemedText>
                </View>

                <Pressable key={"close-circle-outline"} onPress={onDeleteButtonPress}>
                    <MaterialCommunityIcons name="close-circle-outline" size={36} color="black"/>
                </Pressable>
            </View>

            <DownloadTaskRemovalConfirmationModal isVisible={isDeleteConfirmationModalVisible} audiobook={audiobook} onResult={deleteConfirmationModalResult}/>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: 5,
        borderRadius: 5,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    }
})
