import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store";
import DownloadTaskListElement from "@/src/components/app/DownloadTaskListElement";

export interface DownloadTaskListProps {}

export default function DownloadTaskList(props: DownloadTaskListProps) {
    const {activeDownloadTask, downloadTasks} = useSelector((state: RootState) => state.offlineAudiobooks);

    return (
        <View style={styles.container}>
            {downloadTasks.filter(element => element.audiobook.id !== activeDownloadTask?.audiobook.id).map((downloadTask) => (
                <DownloadTaskListElement downloadTask={downloadTask} key={downloadTask.audiobook.id}/>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {}
})
