import {DownloadTask} from "@/src/offline-audiobooks";
import {Pressable, StyleSheet, View, Alert} from "react-native";
import {AudiobookLinkView} from "@/src/views/AudiobookLinkView";
import {ThemedText} from "@/src/views/ThemedText";
import {MaterialIcons} from "@expo/vector-icons";
import {cancelDownloadTask, downloadAudiobook} from "@/src/store/OfflineAudiobooks"
import {useDispatch} from "react-redux";
import {useState} from "react";
import DownloadTaskRemovalConfirmationModal from "@/src/views/DownloadTaskRemovalConfirmationModal";

export interface DownloadTaskListElementViewProps {
    downloadTask: DownloadTask
}

export default function DownloadTaskListElementView(props: DownloadTaskListElementViewProps) {
    const {downloadTask} = props;
    const {audiobook} = downloadTask;
    const dispatch = useDispatch();
    const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false);

    function startDownload() {
        dispatch(downloadAudiobook(audiobook));
    }

    function onButtonClickDelete() {
        setIsDeleteConfirmationModalVisible(true);
    }

    function handleDeleteConfirmation(result: boolean) {
        setIsDeleteConfirmationModalVisible(false);
        if (result) {
            dispatch(cancelDownloadTask(downloadTask))
        }
    }

    return (
        <View style={styles.container}>
            <AudiobookLinkView audiobookId={audiobook.id}>
                <View style={styles.titleContainer}>
                    <ThemedText style={styles.title} type={"subtitle"}>{audiobook.title}</ThemedText>
                </View>
            </AudiobookLinkView>
            <View style={styles.buttonContainer}>
                <Pressable key={"btn-play"} onPress={startDownload}>
                    <MaterialIcons name="play-arrow" size={40} color="black"/>
                </Pressable>
                <Pressable key={"btn-cancel"} onPress={onButtonClickDelete}>
                    <MaterialIcons name="cancel" size={40} color="black"/>
                </Pressable>
            </View>
            <DownloadTaskRemovalConfirmationModal isVisible={isDeleteConfirmationModalVisible} audiobook={audiobook} onResult={handleDeleteConfirmation}/>
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
