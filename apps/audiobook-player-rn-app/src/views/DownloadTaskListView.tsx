import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import DownloadTaskListElementView from "@/src/views/DownloadTaskListElementView";

export interface DownloadTaskListViewProps {}

export default function DownloadTaskListView(props: DownloadTaskListViewProps) {
    const {activeDownloadTask, downloadTasks} = useSelector((state: RootState) => state.offlineAudiobooks);

    return (
        <View style={styles.container}>
            {downloadTasks.filter(element => element.audiobook.id !== activeDownloadTask?.audiobook.id).map((downloadTask) => (
                <DownloadTaskListElementView downloadTask={downloadTask} key={downloadTask.audiobook.id}/>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {}
})
