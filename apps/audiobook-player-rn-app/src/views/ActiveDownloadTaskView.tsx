import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {Pressable, StyleSheet, View} from "react-native";
import {AudiobookLinkView} from "@/src/views/AudiobookLinkView";
import {ThemedText} from "@/src/views/ThemedText";
import {useState} from "react";
import {cancelDownloadTask, downloadAudiobook, pauseActiveDownloadTask} from "@/src/store/OfflineAudiobooks";
import Slider from "@react-native-community/slider";
import SpacerView from "@/src/views/SpacerView";
import DownloadTaskRemovalConfirmationModal from "@/src/views/DownloadTaskRemovalConfirmationModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
                <View style={styles.titleContainer}>
                    <ThemedText style={styles.title} type={"subtitle"}>{audiobook.title}</ThemedText>
                </View>
            </AudiobookLinkView>
            <SpacerView size={5}/>
            <View style={styles.buttonContainer}>
                <Pressable key={"btn-play-pause"} onPress={resumePauseTask}>
                    <MaterialIcons
                        name={activeDownloadTask.isActive ? "pause" : "play-arrow"} size={36}
                        color="black"/>
                </Pressable>

                <Pressable key={"btn-cancel"} onPress={onDeleteButtonPress}>
                    <MaterialIcons name="cancel" size={36} color="black"/>
                </Pressable>
            </View>

            <View style={styles.progressSliderContainer}>
                <Slider
                    style={{height: 40, width: "90%"}}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="black"
                    maximumTrackTintColor="gray"
                    value={activeDownloadTask.progress}
                    disabled={true}
                />
                <ThemedText type={"default"}>{((activeDownloadTask.progress ?? 0) * 100).toFixed(2)}%</ThemedText>
            </View>

            <DownloadTaskRemovalConfirmationModal isVisible={isDeleteConfirmationModalVisible} audiobook={audiobook}
                                                  onResult={deleteConfirmationModalResult}/>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: 10,
        borderRadius: 5,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
        backgroundColor: "white",
    },
    titleContainer: {
        width: "100%",
    },
    title: {
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    progressSliderContainer: {
        alignItems: "center"
    }
})
